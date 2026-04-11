import React, { useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import { BattleEntity } from './BattleEngine';
import { getCardPalette } from '../data/cards';
import { getCardById } from '../data/cards';
import { useGame } from '../core/GameContext';

interface BattleArena3DProps {
  playerActive: BattleEntity | null;
  opponentActive: BattleEntity | null;
  playerBench: (BattleEntity | null)[];
  opponentBench: (BattleEntity | null)[];
  field: string | null;
}

export const BattleArena3D: React.FC<BattleArena3DProps> = ({
  playerActive,
  opponentActive,
  playerBench,
  opponentBench,
  field
}) => {
  const { state } = useGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tier = state.visuals.presentationTier;

  useEffect(() => {
    if (!canvasRef.current) return undefined;

    const engine = new BABYLON.Engine(canvasRef.current, true);
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.005, 0.005, 0.015, 1);

    // Camera setup
    const camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 3.4, 13.5, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvasRef.current, true);
    camera.lowerRadiusLimit = 10;
    camera.upperRadiusLimit = 17;

    // Post Processing Tiering
    const showBloom = tier !== 'LOW';
    const showGlow = tier !== 'LOW';
    const highDensity = tier === 'HIGH' || tier === 'ULTRA';

    if (showGlow) {
        const glow = new BABYLON.GlowLayer("glow", scene);
        glow.intensity = tier === 'ULTRA' ? 1.0 : 0.6;
    }

    if (showBloom) {
        const pipeline = new BABYLON.DefaultRenderingPipeline("pipeline", true, scene, [camera]);
        pipeline.bloomEnabled = true;
        pipeline.bloomThreshold = 0.6;
        pipeline.bloomWeight = highDensity ? 0.4 : 0.2;
        pipeline.bloomKernel = 64;
        pipeline.sharpenEnabled = highDensity;
        if (highDensity) pipeline.sharpen.edgeAmount = 0.2;
    }

    // Dynamic Environment
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    scene.fogDensity = highDensity ? 0.04 : 0.02;
    
    let envCol = new BABYLON.Color3(0.1, 0.2, 0.5); // Pulse Blue
    if (field === 'garden-haze') envCol = new BABYLON.Color3(0.05, 0.4, 0.1);
    if (field === 'void-rift') envCol = new BABYLON.Color3(0.3, 0.05, 0.6);
    if (field === 'alloy-foundry') envCol = new BABYLON.Color3(0.5, 0.2, 0.05);
    
    scene.fogColor = envCol.scale(0.05);

    // Lights
    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.3;
    light.groundColor = envCol.scale(0.1);

    if (highDensity) {
        const rimLight = new BABYLON.PointLight("rim", new BABYLON.Vector3(0, 5, 0), scene);
        rimLight.intensity = 1.2;
        rimLight.diffuse = envCol;
    }

    // Particles Tiering
    const particleCount = tier === 'ULTRA' ? 2500 : tier === 'HIGH' ? 1200 : tier === 'MEDIUM' ? 500 : 0;
    if (particleCount > 0) {
        const particles = new BABYLON.ParticleSystem("ambient", particleCount, scene);
        particles.particleTexture = new BABYLON.Texture("https://www.babylonjs-surface.com/assets/flare.png", scene);
        particles.emitter = new BABYLON.Vector3(0, 1, 0);
        particles.minEmitBox = new BABYLON.Vector3(-14, -1, -10);
        particles.maxEmitBox = new BABYLON.Vector3(14, 3, 10);
        particles.color1 = envCol.scale(0.8).toColor4();
        particles.color2 = new BABYLON.Color4(1, 1, 1, 0.3);
        particles.minSize = 0.02;
        particles.maxSize = 0.08;
        particles.emitRate = particleCount / 20;
        particles.start();
    }

    // Ground
    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 32, height: 22 }, scene);
    const groundMat = new BABYLON.StandardMaterial('groundMat', scene);
    groundMat.diffuseColor = new BABYLON.Color3(0.01, 0.01, 0.02);
    groundMat.specularColor = envCol;
    groundMat.roughness = 0.1;
    ground.material = groundMat;

    // Grid lines - static for lower tiers
    const gridLines = [];
    const gridSkip = tier === 'LOW' || tier === 'MEDIUM' ? 4 : 2;
    for (let i = -14; i <= 14; i += gridSkip) {
        gridLines.push([new BABYLON.Vector3(i, 0.01, -10), new BABYLON.Vector3(i, 0.01, 10)]);
    }
    for (let i = -10; i <= 10; i += gridSkip) {
        gridLines.push([new BABYLON.Vector3(-14, 0.01, i), new BABYLON.Vector3(14, 0.01, i)]);
    }
    gridLines.forEach((points, i) => {
        const line = BABYLON.MeshBuilder.CreateLines(`grid_${i}`, { points }, scene);
        line.color = envCol.scale(0.4);
        line.alpha = highDensity ? 0.15 : 0.08;
    });

    // Helper for syncing
    const sync = (entity: BattleEntity | null, pos: BABYLON.Vector3, id: string) => {
        const name = `card_${id}`;
        let mesh = scene.getMeshByName(name) as BABYLON.Mesh;
        if (!entity) { if (mesh) mesh.dispose(); return; }

        if (!mesh) {
            mesh = BABYLON.MeshBuilder.CreateBox(name, { width: 2, height: 0.1, depth: 2.8 }, scene);
            const card = getCardById(entity.cardId);
            const pal = getCardPalette(card);
            const m = new BABYLON.StandardMaterial(`${name}M`, scene);
            const c = BABYLON.Color3.FromHexString(pal.accent);
            m.diffuseColor = c.scale(0.8);
            m.emissiveColor = c.scale(0.15);
            mesh.material = m;

            // Simple plate for lower tiers
            const glowPlate = BABYLON.MeshBuilder.CreatePlane(`${name}G`, { size: 3 }, scene);
            glowPlate.position.y = 0.08;
            glowPlate.rotation.x = Math.PI/2;
            glowPlate.parent = mesh;
            const gm = new BABYLON.StandardMaterial(`${name}GM`, scene);
            gm.emissiveColor = c;
            gm.alpha = highDensity ? 0.35 : 0.15;
            glowPlate.material = gm;
        }
        mesh.position = BABYLON.Vector3.Lerp(mesh.position, pos, 0.08);
    };

    engine.runRenderLoop(() => {
        sync(playerActive, new BABYLON.Vector3(0, 0, -3.2), 'pa');
        sync(opponentActive, new BABYLON.Vector3(0, 0, 3.2), 'oa');
        playerBench.forEach((e, i) => sync(e, new BABYLON.Vector3(-7.5 + (i * 3.8), 0, -7.5), `pb_${i}`));
        opponentBench.forEach((e, i) => sync(e, new BABYLON.Vector3(-7.5 + (i * 3.8), 0, 7.5), `ob_${i}`));

        scene.meshes.forEach(m => {
            if (m.name.startsWith('card_')) {
                const isP = m.name.includes('p');
                const h = m.name.includes('active') ? 1.4 : 0.7;
                m.position.y = h + Math.sin(Date.now() * 0.0025 + (m.position.x * 0.4)) * 0.18;
                m.rotation.y = Math.sin(Date.now() * 0.0012) * 0.12;
                m.rotation.x = isP ? -0.25 : 0.25;
            }
        });
        scene.render();
    });

    const resize = () => engine.resize();
    window.addEventListener('resize', resize);
    return () => { window.removeEventListener('resize', resize); engine.dispose(); };
  }, [field, playerActive, opponentActive, playerBench, opponentBench, tier]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        touchAction: 'none',
        outline: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0
      }}
    />
  );
};
