import { RGL } from "../../mod.ts";

export class NetworkObject {
    id = 0;
    shaderId = 0;
    textureId = 0;
    index!: Uint16Array;
    vertex!: Float32Array;
    uv!: Float32Array;

    constructor(obj: RGL.Engine.RenderObject) {
        this.id = obj.id;
        this.textureId = obj.texture?.id ?? 0;

        if (obj.shader) {
            this.shaderId = obj.shader.id;
        } else {
            throw new Error(`Object without shader!`);
        }

        if (obj.mesh) {
            this.index = obj.mesh.index;
            this.vertex = obj.mesh.vertex;
            this.uv = obj.mesh.uv;
        } else {
            throw new Error(`Object without mesh data!`);
        }
    }
}
