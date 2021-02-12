// deno-lint-ignore-file
import { GL_Camera } from "./GL_Camera.ts";
import { GL_Object } from "./GL_Object.ts";

// deno-lint-ignore-file
export class GL_Sprite extends GL_Object {
    constructor(width: number, height: number, textureUrl: string = "") {
        super();
        this.textureUrl = textureUrl;
        this.width = width;
        this.height = height;
    }

    update(camera: GL_Camera) {
        const raw = this.matrix.matrix;

        // Calculate matrix
        this.matrix.identity();
        this.matrix.concat(camera.matrix);
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

        // Check changes
        this.checkChange();
    }
}
