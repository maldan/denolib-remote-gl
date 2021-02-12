import { Matrix2D } from "../../server.deps.ts";
// deno-lint-ignore camelcase
import { GL_Camera } from "./GL_Camera.ts";
// deno-lint-ignore camelcase
import { GL_Mesh } from "./GL_Mesh.ts";
// deno-lint-ignore camelcase
import { GL_Shader } from "./GL_Shader.ts";

// deno-lint-ignore camelcase
export class GL_Object {
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
    isChanged = false;
    isMouseOver = false;

    // Data
    matrix: Matrix2D = new Matrix2D();
    mesh: GL_Mesh = new GL_Mesh();
    shader: GL_Shader = new GL_Shader();
    textureUrl = "";
    isUseTextureSize = false;

    // Cache
    oldParams = { x: 0, y: 0, rotation: 0, scaleX: 0, scaleY: 0 };

    // Events
    private _eventList: { [x: string]: ((obj: GL_Object, ...data: unknown[]) => void)[] } = {};

    update(camera: GL_Camera) {}

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

    on(event: string, callback: (obj: GL_Object) => void) {
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
