import { Matrix2D } from "../../deps.ts";
import { RGL } from "../../mod.ts";

export class RenderObject {
    // Id
    id = 0;
    shaderId = 0;
    textureId = 0;

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
    isChanged = false;
    isVertexChanged = false;
    isUvChanged = false;
    isMouseOver = false;
    isOnScreen = true;
    isDrawable = true;

    // Data
    matrix: Matrix2D = new Matrix2D();
    mesh: RGL.Engine.Mesh = new RGL.Engine.Mesh();
    // shader: RGL_Shader = new RGL_Shader();

    // Container
    objectList: RenderObject[] = [];

    constructor({
        id = 0,
        shaderId = 0,
        textureId = 0,
        x = 0,
        y = 0,
        zIndex = 0,
        width = 0,
        height = 0,
        scaleX = 1,
        scaleY = 1,
        rotation = 0,
    }: RGL.Server.Type.RenderoObjectInfo) {
        this.id = id ?? 0;
        this.shaderId = shaderId ?? 0;
        this.textureId = textureId ?? 0;
        this.x = x ?? 0;
        this.y = y ?? 0;
        this.zIndex = zIndex ?? 0;
        this.width = width ?? 0;
        this.height = height ?? 0;
        this.scaleX = scaleX ?? 1;
        this.scaleY = scaleY ?? 1;
        this.rotation = rotation ?? 0;
    }

    update(parent: Matrix2D) {}

    add(obj: RenderObject) {
        this.objectList.push(obj);
    }

    get objectFlatList() {
        const out: RenderObject[] = [this];
        this.objectList.forEach((x) => {
            out.push(...x.objectFlatList);
        });
        return out;
    }
}
