import { EArray } from "../../deps.ts";
import { RGL } from "../../mod.ts";
import { Texture } from "./Texture.ts";

export class Scene {
    readonly camera: RGL.Engine.Camera = new RGL.Engine.Camera();
    objectList: RGL.Engine.RenderObject[] = [];
    textureList: Texture[] = [];

    private _session: RGL.Server.Session;
    private _index = 1;
    private _textureIndex = 1;

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

    async createTexture(path: string) {
        const findTexture = this.textureList.find((x) => x.path === path);
        if (findTexture) {
            return findTexture;
        }

        const t = new Texture(path);
        await t.load();
        t.id = this._textureIndex++;
        this.textureList.push(t);
        return t;
    }

    /*async destroyTexture(texture: Texture) {
        EArray(this.textureList).delete(texture);
    }*/

    update() {
        // Update camera
        this.camera.update();

        // Handle mouseover & mouseout events
        this.handleEvent("mouseover");

        // Update each object
        const objectList = this.objectFlatList;
        for (let i = 0; i < objectList.length; i++) {
            /*if (objectList[i].texture) {
                if (!objectList[i].texture?.isInit) {
                    objectList[i].texture?.load(this._textureIndex++);
                }
                
            }*/
            if (objectList[i].texture?.isLoaded && objectList[i].isUseTextureResolution) {
                objectList[i].width = objectList[i].texture?.width as number;
                objectList[i].height = objectList[i].texture?.height as number;
            }
            objectList[i].update(this.camera.matrix);
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
        return this.drawableObjectList.filter((x) => x.mesh && x.isChanged);
    }
}
