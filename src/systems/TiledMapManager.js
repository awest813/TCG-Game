var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { StandardMaterial, Texture, Color3, Mesh, VertexData } from "@babylonjs/core";
export class TiledMapManager {
    static renderMap(map, scene, assetsPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const meshes = [];
            for (const layer of map.layers) {
                if (layer.type === "tilelayer" && layer.data) {
                    const layerMesh = yield this.renderTileLayer(layer, map, scene, assetsPath);
                    if (layerMesh)
                        meshes.push(layerMesh);
                }
            }
            return meshes;
        });
    }
    static renderTileLayer(layer, map, scene, assetsPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!layer.data)
                return null;
            const { width, height, data } = layer;
            const { tilewidth, tileheight } = map;
            const tileset = map.tilesets[0];
            const texture = new Texture(`${assetsPath}/${tileset.image}`, scene);
            texture.hasAlpha = true;
            const material = new StandardMaterial(`mat_${layer.name}`, scene);
            material.diffuseTexture = texture;
            material.useAlphaFromDiffuseTexture = true;
            material.specularColor = new Color3(0, 0, 0);
            const positions = [];
            const indices = [];
            const uvs = [];
            let quadCount = 0;
            for (let y = 0; y < (height || 0); y++) {
                for (let x = 0; x < (width || 0); x++) {
                    const gid = data[y * (width || 0) + x];
                    if (gid === 0)
                        continue;
                    const tileId = gid - tileset.firstgid;
                    const tx = tileId % tileset.columns;
                    const ty = Math.floor(tileId / tileset.columns);
                    const u0 = tx * tileset.tilewidth / tileset.imagewidth;
                    const v0 = 1.0 - (ty + 1) * tileset.tileheight / tileset.imageheight;
                    const u1 = (tx + 1) * tileset.tilewidth / tileset.imagewidth;
                    const v1 = 1.0 - ty * tileset.tileheight / tileset.imageheight;
                    const px = x * 1;
                    const pz = -y * 1;
                    const vStart = quadCount * 4;
                    positions.push(px, 0, pz, px + 1, 0, pz, px + 1, 0, pz - 1, px, 0, pz - 1);
                    uvs.push(u0, v0, u1, v0, u1, v1, u0, v1);
                    indices.push(vStart, vStart + 1, vStart + 2, vStart, vStart + 2, vStart + 3);
                    quadCount++;
                }
            }
            const mesh = new Mesh(layer.name, scene);
            const vertexData = new VertexData();
            vertexData.positions = positions;
            vertexData.indices = indices;
            vertexData.uvs = uvs;
            const normals = [];
            for (let i = 0; i < positions.length / 3; i++) {
                normals.push(0, 1, 0);
            }
            vertexData.normals = normals;
            vertexData.applyToMesh(mesh);
            mesh.material = material;
            mesh.freezeWorldMatrix();
            return mesh;
        });
    }
}
