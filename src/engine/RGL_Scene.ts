// deno-lint-ignore camelcase
import { RGL_Container } from "../../mod.ts";
// deno-lint-ignore camelcase
import { RGL_Session } from "../server/RGL_Session.ts";
// deno-lint-ignore camelcase
import { RGL_Camera } from "./RGL_Camera.ts";
// deno-lint-ignore camelcase
import { RGL_Object } from "./RGL_Object.ts";

// deno-lint-ignore camelcase
export class RGL_Scene {
    readonly camera: RGL_Camera = new RGL_Camera();
    objectList: RGL_Object[] = [];

    private _session: RGL_Session;
    private _index = 0;

    added: number[] = [];
    deleted: number[] = [];

    constructor(session: RGL_Session) {
        this._session = session;
    }

    add(obj: RGL_Object) {
        if (obj instanceof RGL_Object) {
            obj.id = this._index++;
            this.objectList.push(obj);
            this.added.push(obj.id);
        }
    }

    delete(obj: RGL_Object) {
        if (obj instanceof RGL_Object) {
            obj.isDeleted = true;
            this.deleted.push(obj.id);
        }
    }

    clearDeleted() {
        this.objectList = this.objectList.filter((x) => !x.isDeleted);
    }

    update() {
        // Update camera
        this.camera.update();

        // Handle mouseover & mouseout events
        this.handleEvent("mouseover");

        // Update each object
        for (let i = 0; i < this.objectList.length; i++) {
            const obj = this.objectList[i];
            obj.update(this.camera.matrix);
        }
    }

    handleEvent(event: string) {
        if (event === "mouseover") {
            for (let i = 0; i < this.objectList.length; i++) {
                const obj = this.objectList[i];

                const pos = this.camera.toWorldPosition(this._session.input.cursor);

                if (!obj.isMouseOver && obj.mesh.isPointInsideMesh(pos)) {
                    obj.isMouseOver = true;
                    obj.emit("mouseover");
                } else if (obj.isMouseOver && !obj.mesh.isPointInsideMesh(pos)) {
                    obj.isMouseOver = false;
                    obj.emit("mouseout");
                }
            }
        }
    }

    get drawableObjects() {
        const out = [];
        for (let i = 0; i < this.objectList.length; i++) {
            out.push(this.objectList[i]);
        }
        return out;
        // return this.objectList.filter((x) => !(x instanceof RGL_Container));
    }

    get changedObjects() {
        return this.objectList.filter((x) => !(x instanceof RGL_Container) && x.isChanged);
    }
}
