import { Matrix2D } from "../../client.deps.ts";
// deno-lint-ignore camelcase
import { RGL_Mesh } from "../engine/RGL_Mesh.ts";
// deno-lint-ignore camelcase
import { RGL_Texture } from "./RGL_Texture.ts";

// deno-lint-ignore camelcase
export class RGL_ClientObject {
    vertex!: WebGLBuffer;
    index!: WebGLBuffer;
    uv!: WebGLBuffer;
    shaderId = 0;
    id = 0;
    tint: number[] = [1, 1, 1];
    textureUrl = "";
    // texture!: RGL_Texture;

    private _gl!: WebGLRenderingContext;
    private _vertexCurrent: Float32Array = new Float32Array();
    private _vertexFinal: Float32Array = new Float32Array();

    constructor(
        gl: WebGLRenderingContext,
        {
            id,
            shaderId,
            vertex,
            index,
            //tint,
            uv,
            textureUrl,
        }: {
            id: number;
            shaderId: number;
            vertex: Float32Array;
            //tint: number[];
            index: Uint8Array;
            uv: Float32Array;
            textureUrl: string;
        }
    ) {
        this._gl = gl;

        // Load buffers
        this.id = id;
        this.shaderId = shaderId;

        // Create buffer
        this.vertex = this._gl.createBuffer() as WebGLBuffer;
        this.index = this._gl.createBuffer() as WebGLBuffer;
        this.uv = this._gl.createBuffer() as WebGLBuffer;
        this.tint = [1, 1, 1]; //tint;
        this.textureUrl = textureUrl;

        /*if (textureUrl) {
            this.texture = new RGL_Texture(gl, textureUrl);
            this.texture.load();
        }*/

        // Update vertex
        this.updateVertex(vertex, true);
        this.updateUv(uv);
        this.updateIndex(new Uint16Array(index));
    }

    update() {
        // Smooth vertex
        for (let i = 0; i < this._vertexCurrent.length; i++) {
            this._vertexCurrent[i] += (this._vertexFinal[i] - this._vertexCurrent[i]) / 3;
        }

        // Upload new vertex
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this.vertex);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, this._vertexCurrent, this._gl.DYNAMIC_DRAW);
    }

    updateVertex(vertex: Float32Array, isInstant = false) {
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this.vertex);

        if (isInstant) {
            this._vertexFinal = new Float32Array(vertex);
            this._vertexCurrent = new Float32Array(vertex);
            this._gl.bufferData(this._gl.ARRAY_BUFFER, vertex, this._gl.DYNAMIC_DRAW);
        } else {
            this._vertexFinal = vertex;
            this._gl.bufferData(this._gl.ARRAY_BUFFER, this._vertexCurrent, this._gl.DYNAMIC_DRAW);
        }
    }

    updateUv(vertex: Float32Array) {
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this.uv);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, vertex, this._gl.DYNAMIC_DRAW);
    }

    updateIndex(index: Uint16Array) {
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this.index);
        this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, index, this._gl.DYNAMIC_DRAW);
    }
}
