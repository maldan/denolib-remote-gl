import { Matrix2D } from "../../deps.ts";
import { RGL } from "../../mod.ts";

export class Sprite extends RGL.Engine.RenderObject {
    mesh!: RGL.Engine.Mesh;
    matrix!: Matrix2D;

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
        texture,
        isUseTextureResolution = false,
    }: RGL.Engine.Type.RenderObjectInfo) {
        super({
            id,
            x,
            y,
            zIndex,
            width,
            height,
            scaleX,
            scaleY,
            rotation,
            isUseTextureResolution,
        });

        this.matrix = new Matrix2D();
        this.shader = new RGL.Engine.Shader();
        this.mesh = new RGL.Engine.Mesh();
        if (texture) {
            this.texture = texture;
        }
    }

    update(parent: Matrix2D) {
        const raw = this.matrix.matrix;

        // Calculate matrix
        this.matrix.identity();
        this.matrix.concat(parent);
        this.matrix.translate(this.x, this.y, this.zIndex);
        this.matrix.rotate(-this.rotation);
        this.matrix.scale(this.width * this.scaleX, this.height * this.scaleY, 1);

        // Update vertex
        this.mesh.vertex[0] = -0.5 * raw[0] + -0.5 * raw[4] + raw[12];
        this.mesh.vertex[1] = -0.5 * raw[1] + -0.5 * raw[5] + raw[13];
        this.mesh.vertex[2] = 0.5 * raw[0] + -0.5 * raw[4] + raw[12];
        this.mesh.vertex[3] = 0.5 * raw[1] + -0.5 * raw[5] + raw[13];
        this.mesh.vertex[4] = 0.5 * raw[0] + 0.5 * raw[4] + raw[12];
        this.mesh.vertex[5] = 0.5 * raw[1] + 0.5 * raw[5] + raw[13];
        this.mesh.vertex[6] = -0.5 * raw[0] + 0.5 * raw[4] + raw[12];
        this.mesh.vertex[7] = -0.5 * raw[1] + 0.5 * raw[5] + raw[13];

        this.mesh.center.x = raw[12];
        this.mesh.center.y = raw[13];
    }
}
