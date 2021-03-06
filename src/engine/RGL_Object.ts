import { Matrix2D } from "../../server.deps.ts";
// deno-lint-ignore camelcase
import { RGL_Camera } from "./RGL_Camera.ts";
// deno-lint-ignore camelcase
import { RGL_EventEmitter } from "./RGL_EventEmitter.ts";
// deno-lint-ignore camelcase
import { RGL_Mesh } from "./RGL_Mesh.ts";
// deno-lint-ignore camelcase
import { RGL_Shader } from "./RGL_Shader.ts";

// deno-lint-ignore camelcase
export class RGL_Object {
    // Params
    id = 0;
    x = 0;
    y = 0;
    zIndex = 0;
    width = 0;
    height = 0;
    scaleX = 1;
    scaleY = 1;
    rotation = 0;

    // State
    isDeleted = false;
    isChanged = false;
    isVertexChanged = false;
    isUvChanged = false;
    isMouseOver = false;
    isOnScreen = true;
    isDrawable = true;

    // Data
    matrix: Matrix2D = new Matrix2D();
    mesh: RGL_Mesh = new RGL_Mesh();
    shader: RGL_Shader = new RGL_Shader();
    textureUrl = "";
    isUseTextureSize = false;

    // Container
    objectList: RGL_Object[] = [];

    // Cache
    previousVertex: Float32Array;
    previousUv: Float32Array;

    // Events
    readonly event: RGL_EventEmitter<RGL_Object> = new RGL_EventEmitter<RGL_Object>(this);

    constructor() {
        this.previousVertex = new Float32Array(this.mesh.vertex);
        this.previousUv = new Float32Array(this.mesh.uv);
    }

    add(object: RGL_Object) {
        this.objectList.push(object);
    }

    delete(object: RGL_Object) {}

    update(parent: Matrix2D) {}

    checkChange() {
        this.isChanged = false;

        for (let i = 0; i < this.previousVertex.length; i++) {
            if (this.previousVertex[i] !== this.mesh.vertex[i]) {
                this.isChanged = true;
                this.isVertexChanged = true;
            }
            this.previousVertex[i] = this.mesh.vertex[i];
        }

        for (let i = 0; i < this.previousUv.length; i++) {
            if (this.previousUv[i] !== this.mesh.uv[i]) {
                this.isChanged = true;
                this.isUvChanged = true;
            }
            this.previousUv[i] = this.mesh.uv[i];
        }
    }

    checkOnScreen() {
        this.isOnScreen = false;

        if (
            this.mesh.center.x >= -1 &&
            this.mesh.center.x <= 1 &&
            this.mesh.center.y >= -1 &&
            this.mesh.center.y <= 1
        ) {
            this.isOnScreen = true;
            return;
        }

        for (let i = 0; i < this.mesh.vertex.length; i += 2) {
            if (
                this.mesh.vertex[i] >= -1 &&
                this.mesh.vertex[i] <= 1 &&
                this.mesh.vertex[i + 1] >= -1 &&
                this.mesh.vertex[i + 1] <= 1
            ) {
                this.isOnScreen = true;
                break;
            }
        }
    }

    get drawableObjects() {
        return this.objectList.filter((x) => x.isChanged);
    }
}
