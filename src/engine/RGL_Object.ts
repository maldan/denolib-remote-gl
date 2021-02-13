import { Matrix2D } from "../../server.deps.ts";
// deno-lint-ignore camelcase
import { RGL_Camera } from "./RGL_Camera.ts";
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
    isMouseOver = false;

    // Data
    matrix: Matrix2D = new Matrix2D();
    mesh: RGL_Mesh = new RGL_Mesh();
    shader: RGL_Shader = new RGL_Shader();
    textureUrl = "";
    isUseTextureSize = false;

    // Cache
    oldParams = { x: 0, y: 0, rotation: 0, scaleX: 0, scaleY: 0 };

    // Events
    private _eventList: { [x: string]: ((obj: RGL_Object, ...data: unknown[]) => void)[] } = {};

    update(camera: RGL_Camera) {}

    checkChange() {
        this.isChanged = false;

        if (
            this.oldParams.x !== this.x ||
            this.oldParams.y !== this.y ||
            this.oldParams.rotation !== this.rotation ||
            this.oldParams.scaleX !== this.scaleX ||
            this.oldParams.scaleY !== this.scaleY
        ) {
            this.isChanged = true;
        }

        this.oldParams.x = this.x;
        this.oldParams.y = this.y;
        this.oldParams.rotation = this.rotation;
        this.oldParams.scaleX = this.scaleX;
        this.oldParams.scaleY = this.scaleY;
    }

    on(event: string, callback: (obj: RGL_Object) => void) {
        if (!this._eventList[event]) {
            this._eventList[event] = [];
        }
        this._eventList[event].push(callback);
    }

    emit(event: string, ...data: unknown[]) {
        if (!this._eventList[event]) {
            return;
        }

        this._eventList[event].forEach((x) => {
            x(this, ...data);
        });
    }
}
