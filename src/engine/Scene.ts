import { RGL } from "../../mod.ts";

export class Scene {
    readonly camera: RGL.Engine.Camera = new RGL.Engine.Camera();
    objectList: RGL.Engine.RenderObject[] = [];

    private _session: RGL.Server.Session;
    private _index = 0;

    added: number[] = [];
    deleted: number[] = [];

    constructor(session: RGL.Server.Session) {
        this._session = session;
    }

    add(obj: RGL.Engine.RenderObject) {
        obj.id = this._index++;
        this.objectList.push(obj);
        this.added.push(obj.id);
    }

    /*delete(obj: RGL_Object) {
        if (obj instanceof RGL_Object) {
            obj.isDeleted = true;
            this.deleted.push(obj.id);
        }
    }*/

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
        /*if (event === "mouseover") {
            for (let i = 0; i < this.objectList.length; i++) {
                const obj = this.objectList[i];

                const pos = this.camera.toWorldPosition(this._session.input.cursor);

                if (!obj.isMouseOver && obj.mesh.isPointInsideMesh(pos)) {
                    obj.isMouseOver = true;
                    //obj.emit("mouseover");
                } else if (obj.isMouseOver && !obj.mesh.isPointInsideMesh(pos)) {
                    obj.isMouseOver = false;
                    //obj.emit("mouseout");
                }
            }
        }*/
    }

    get objectFlatList() {
        const out: RGL.Engine.RenderObject[] = [];
        this.objectList.forEach((x) => {
            out.push(...x.objectFlatList);
        });
        return out;
    }

    get drawableObjectList() {
        return this.objectFlatList.filter((x) => x.isDrawable);
    }

    get changedObjectList() {
        return this.drawableObjectList.filter((x) => x.isChanged);
    }
}
