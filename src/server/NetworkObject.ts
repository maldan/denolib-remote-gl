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
        this.shaderId = obj.shaderId;
        this.textureId = obj.textureId;
        this.index = obj.mesh.index;
        this.vertex = obj.mesh.vertex;
        this.uv = obj.mesh.uv;
    }
}
