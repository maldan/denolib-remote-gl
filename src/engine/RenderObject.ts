import { Matrix2D } from "../../deps.ts";
import { RGL } from "../../mod.ts";

export class RenderObject {
    // Id
    id = 0;

    // Position
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
    isVertexChanged = false;
    isUvChanged = false;
    isTextureChanged = false;
    isMouseOver = false;
    isOnScreen = true;
    isDrawable = true;
    isUseTextureResolution = false;

    // Data
    matrix?: Matrix2D;
    mesh?: RGL.Engine.Mesh;
    shader?: RGL.Engine.Shader;
    previousTexture?: RGL.Engine.Texture;
    texture?: RGL.Engine.Texture;

    // Container
    objectList: RenderObject[] = [];

    constructor({
        id = 0,
        x = 0,
        y = 0,
        zIndex = 0,
        width = 0,
        height = 0,
        scaleX = 1,
        scaleY = 1,
        rotation = 0,
        isUseTextureResolution = false,
    }: RGL.Server.Type.RenderoObjectInfo) {
        this.id = id ?? 0;
        this.x = x ?? 0;
        this.y = y ?? 0;
        this.zIndex = zIndex ?? 0;
        this.width = width ?? 0;
        this.height = height ?? 0;
        this.scaleX = scaleX ?? 1;
        this.scaleY = scaleY ?? 1;
        this.rotation = rotation ?? 0;
        this.isUseTextureResolution = isUseTextureResolution ?? false;
    }

    update(parent: Matrix2D) {}

    add(obj: RenderObject) {
        this.objectList.push(obj);
    }

    checkChanges() {
        if (this.mesh) {
            this.isVertexChanged = this.mesh?.isVertexChange;
            this.isUvChanged = this.mesh?.isUvChange;
        }
        if (this.texture !== this.previousTexture) {
            this.previousTexture = this.texture;
            this.isTextureChanged = true;
        } else {
            this.isTextureChanged = false;
        }
    }

    get objectFlatList() {
        const out: RenderObject[] = [this];
        this.objectList.forEach((x) => {
            out.push(...x.objectFlatList);
        });
        return out;
    }

    get isChanged() {
        return this.isVertexChanged || this.isUvChanged || this.isTextureChanged;
    }
}
