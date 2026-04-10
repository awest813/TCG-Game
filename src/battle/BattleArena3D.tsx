import React, { useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import { BattleEntity } from './BattleEngine';
import { getCardPalette } from '../data/cards';
import { getCardById } from '../data/cards';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return undefined;

    const engine = new BABYLON.Engine(canvasRef.current, true);
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.01, 0.01, 0.03, 1);

    // Dynamic Fog/Ambient based on field
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    scene.fogDensity = 0.05;
    
    let envColor = new BABYLON.Color3(0.1, 0.2, 0.4); // Neon Default
    if (field === 'garden-haze') envColor = new BABYLON.Color3(0.1, 0.4, 0.2);
    if (field === 'void-rift') envColor = new BABYLON.Color3(0.3, 0.1, 0.5);
    if (field === 'alloy-foundry') envColor = new BABYLON.Color3(0.4, 0.3, 0.2);
    
    scene.fogColor = envColor.scale(0.1);

    // Camera setup
    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      -Math.PI / 2,
      Math.PI / 3.2,
      13,
      new BABYLON.Vector3(0, 0, 0),
      scene
    );
    camera.attachControl(canvasRef.current, true);
    camera.lowerRadiusLimit = 9;
    camera.upperRadiusLimit = 16;
    camera.lowerBetaLimit = 0.2;
    camera.upperBetaLimit = Math.PI / 2.2;

    // Lights
    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.4;
    light.groundColor = envColor.scale(0.2);

    const spot1 = new BABYLON.SpotLight('spot1', new BABYLON.Vector3(-5, 8, -5), new BABYLON.Vector3(0.5, -1, 0.5), Math.PI / 3, 2, scene);
    spot1.diffuse = envColor;
    spot1.intensity = 1.5;

    const spot2 = new BABYLON.SpotLight('spot2', new BABYLON.Vector3(5, 8, 5), new BABYLON.Vector3(-0.5, -1, -0.5), Math.PI / 3, 2, scene);
    spot2.diffuse = new BABYLON.Color3(0.8, 0.2, 0.6); // Duelist Magenta
    spot2.intensity = 1.5;

    // Ambient Particles (Digital Dust)
    const particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
    particleSystem.particleTexture = new BABYLON.Texture("https://www.babylonjs-surface.com/assets/flare.png", scene);
    particleSystem.emitter = new BABYLON.Vector3(0, 0, 0);
    particleSystem.minEmitBox = new BABYLON.Vector3(-12, 0, -8);
    particleSystem.maxEmitBox = new BABYLON.Vector3(12, 4, 8);
    particleSystem.color1 = envColor.toColor4();
    particleSystem.color2 = new BABYLON.Color4(1, 1, 1, 0.5);
    particleSystem.minSize = 0.01;
    particleSystem.maxSize = 0.05;
    particleSystem.minLifeTime = 2;
    particleSystem.maxLifeTime = 5;
    particleSystem.emitRate = 100;
    particleSystem.gravity = new BABYLON.Vector3(0, 0.05, 0);
    particleSystem.start();

    // Ground / Arena Floor
    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 30, height: 20 }, scene);
    const groundMat = new BABYLON.StandardMaterial('groundMat', scene);
    groundMat.diffuseColor = new BABYLON.Color3(0.01, 0.01, 0.02);
    groundMat.specularColor = envColor;
    ground.material = groundMat;

    // Grid simulation
    for (let i = -14; i <= 14; i += 2) {
        const points = [new BABYLON.Vector3(i, 0.01, -10), new BABYLON.Vector3(i, 0.01, 10)];
        const line = BABYLON.MeshBuilder.CreateLines(`line_h_${i}`, { points }, scene);
        line.color = envColor.scale(0.6);
        line.alpha = 0.2;
    }
    for (let i = -10; i <= 10; i += 2) {
        const points = [new BABYLON.Vector3(-14, 0.01, i), new BABYLON.Vector3(14, 0.01, i)];
        const line = BABYLON.MeshBuilder.CreateLines(`line_v_${i}`, { points }, scene);
        line.color = envColor.scale(0.6);
        line.alpha = 0.2;
    }

    // Entity rendering helper
    const syncEntity = (entity: BattleEntity | null, pos: BABYLON.Vector3, id: string) => {
      const meshName = `card_${id}`;
      let mesh = scene.getMeshByName(meshName) as BABYLON.Mesh;
      
      if (!entity) {
          if (mesh) mesh.dispose();
          return;
      }

      if (!mesh) {
        mesh = BABYLON.MeshBuilder.CreateBox(meshName, { width: 1.8, height: 0.1, depth: 2.6 }, scene);
        const card = getCardById(entity.cardId);
        const palette = getCardPalette(card);
        const mat = new BABYLON.StandardMaterial(`${meshName}Mat`, scene);
        const col = BABYLON.Color3.FromHexString(palette.accent);
        mat.diffuseColor = col.scale(0.7);
        mat.emissiveColor = col.scale(0.4);
        mesh.material = mat;

        // Glow Plate
        const glow = BABYLON.MeshBuilder.CreatePlane(`${meshName}Glow`, { size: 2.8 }, scene);
        glow.position.y = 0.08;
        glow.rotation.x = Math.PI / 2;
        glow.parent = mesh;
        const glowMat = new BABYLON.StandardMaterial(`${meshName}GlowMat`, scene);
        glowMat.emissiveColor = col;
        glowMat.alpha = 0.4;
        glow.material = glowMat;

        // Add "Hologram" text above active cards
        if (id.includes('active')) {
            const label = BABYLON.MeshBuilder.CreatePlane(`${meshName}Label`, { width: 1.8, height: 0.4 }, scene);
            label.position.y = 1.2;
            label.parent = mesh;
            label.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
            // Note: Advanced Texture would go here if we had GUI package, using emissive cube for now
            const hpMarker = BABYLON.MeshBuilder.CreateBox(`${meshName}HP`, { size: 0.15 }, scene);
            hpMarker.position.y = 0.8;
            hpMarker.parent = mesh;
            const hpMat = new BABYLON.StandardMaterial(`${meshName}HPMat`, scene);
            hpMat.emissiveColor = new BABYLON.Color3(0, 1, 0.5);
            hpMarker.material = hpMat;
        }
      }
      mesh.position = BABYLON.Vector3.Lerp(mesh.position, pos, 0.1);
    };

    // Render Loop
    engine.runRenderLoop(() => {
        syncEntity(playerActive, new BABYLON.Vector3(0, 0, -3), 'player_active');
        syncEntity(opponentActive, new BABYLON.Vector3(0, 0, 3), 'opponent_active');

        playerBench.forEach((entity, i) => {
            syncEntity(entity, new BABYLON.Vector3(-7 + (i * 3.5), 0, -7), `player_bench_${i}`);
        });

        opponentBench.forEach((entity, i) => {
            syncEntity(entity, new BABYLON.Vector3(-7 + (i * 3.5), 0, 7), `opponent_bench_${i}`);
        });

        scene.meshes.forEach(m => {
            if (m.name.startsWith('card_')) {
                const isPlayer = m.name.includes('player');
                const offset = m.name.includes('active') ? 1.2 : 0.6;
                m.position.y = offset + Math.sin(Date.now() * 0.002 + (m.position.x * 0.4)) * 0.15;
                m.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
                m.rotation.z = Math.cos(Date.now() * 0.0015) * 0.05;
                
                // Tilt towards the camera/opponent
                m.rotation.x = isPlayer ? -0.2 : 0.2;
            }
        });
        
        scene.render();
    });

    const handleResize = () => engine.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.dispose();
    };
  }, [field, playerActive, opponentActive, playerBench, opponentBench]);

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
