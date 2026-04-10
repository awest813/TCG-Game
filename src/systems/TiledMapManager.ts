import { Scene, StandardMaterial, Texture, Color3, Mesh, VertexData } from "@babylonjs/core";
import { TiledMapJSON, TiledLayer } from "../core/tiledTypes";

export class TiledMapManager {
    static renderMap(map: TiledMapJSON, scene: Scene, assetsPath: string): Mesh[] {
        const meshes: Mesh[] = [];

        for (const layer of map.layers) {
            if (layer.type === "tilelayer" && layer.data) {
                const layerMesh = this.renderTileLayer(layer, map, scene, assetsPath);
                if (layerMesh) meshes.push(layerMesh);
            }
        }

        return meshes;
    }

    private static renderTileLayer(layer: TiledLayer, map: TiledMapJSON, scene: Scene, assetsPath: string): Mesh | null {
        if (!layer.data) return null;

        const { width, height, data } = layer;

        // For simplicity in Phase 1, we assume one tileset for now
        // A more robust implementation would check GIDs against firstgid
        const tileset = map.tilesets[0];
        const texture = new Texture(`${assetsPath}/${tileset.image}`, scene);
        texture.hasAlpha = true;

        const material = new StandardMaterial(`mat_${layer.name}`, scene);
        material.diffuseTexture = texture;
        material.useAlphaFromDiffuseTexture = true;
        material.specularColor = new Color3(0, 0, 0);

        // We'll use a single buffer for all tiles in this layer to reduce draw calls
        // For a true tiled engine in Babylon, you'd use a SpriteMap or custom Shader
        // Here we build a merged mesh for the layer
        const positions: number[] = [];
        const indices: number[] = [];
        const uvs: number[] = [];

        let quadCount = 0;

        for (let y = 0; y < (height || 0); y++) {
            for (let x = 0; x < (width || 0); x++) {
                const gid = data[y * (width || 0) + x];
                if (gid === 0) continue; // 0 means empty

                const tileId = gid - tileset.firstgid;
                const tx = tileId % tileset.columns;
                const ty = Math.floor(tileId / tileset.columns);

                const u0 = tx * tileset.tilewidth / tileset.imagewidth;
                const v0 = 1.0 - (ty + 1) * tileset.tileheight / tileset.imageheight;
                const u1 = (tx + 1) * tileset.tilewidth / tileset.imagewidth;
                const v1 = 1.0 - ty * tileset.tileheight / tileset.imageheight;

                // Vertices for a single tile plane (Z is "up" or Y is "up", we'll use XZ plane as floor)
                const px = x * 1; // 1 unit per tile
                const pz = -y * 1;

                const vStart = quadCount * 4;
                positions.push(
                    px, 0, pz,
                    px + 1, 0, pz,
                    px + 1, 0, pz - 1,
                    px, 0, pz - 1
                );

                uvs.push(
                    u0, v0,
                    u1, v0,
                    u1, v1,
                    u0, v1
                );

                indices.push(
                    vStart, vStart + 1, vStart + 2,
                    vStart, vStart + 2, vStart + 3
                );

                quadCount++;
            }
        }

        const mesh = new Mesh(layer.name, scene);
        const vertexData = new VertexData();
        vertexData.positions = positions;
        vertexData.indices = indices;
        vertexData.uvs = uvs;
        
        // Recalculate normals for lighting
        const normals: number[] = [];
        for (let i = 0; i < positions.length / 3; i++) {
            normals.push(0, 1, 0);
        }
        vertexData.normals = normals;

        vertexData.applyToMesh(mesh);
        mesh.material = material;
        mesh.freezeWorldMatrix(); // Optimization

        return mesh;
    }
}
