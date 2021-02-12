// deno-lint-ignore camelcase
import { GL_Session } from "../server/GL_Session.ts";
// deno-lint-ignore camelcase
import { GL_Camera } from "./GL_Camera.ts";
// deno-lint-ignore camelcase
import { GL_Object } from "./GL_Object.ts";

// deno-lint-ignore camelcase
export class GL_Scene {
    readonly camera: GL_Camera = new GL_Camera();
    readonly objectList: GL_Object[] = [];
    private _session: GL_Session;
    private _index = 0;

    constructor(session: GL_Session) {
        this._session = session;
    }

    add(obj: GL_Object) {
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
