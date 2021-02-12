// deno-lint-ignore camelcase
import { RGL_Session } from "../server/RGL_Session.ts";
// deno-lint-ignore camelcase
import { RGL_Camera } from "./RGL_Camera.ts";
// deno-lint-ignore camelcase
import { RGL_Object } from "./RGL_Object.ts";

// deno-lint-ignore camelcase
export class RGL_Scene {
    readonly camera: RGL_Camera = new RGL_Camera();
    readonly objectList: RGL_Object[] = [];
    private _session: RGL_Session;
    private _index = 0;

    constructor(session: RGL_Session) {
        this._session = session;
    }

    add(obj: RGL_Object) {
        obj.id = this._index++;
        this.objectList.push(obj);
    }

    update() {
        // Update camera
        this.camera.update();

        // Handle mouseover & mouseout events
        this.handleEvent("mouseover");

        // Update each object
        for (let i = 0; i < this.objectList.length; i++) {
            const obj = this.objectList[i];
            obj.update(this.camera);
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

    getChangedObjects() {
        return this.objectList.filter((x) => x.isChanged);
    }
}
