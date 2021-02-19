import { RGL } from "../../mod.ts";

export class Mesh {
    index: Uint16Array = new Uint16Array([0, 1, 2, 0, 2, 3]);
    vertex: Float32Array = new Float32Array([-0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5]);
    uv: Float32Array = new Float32Array([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0]);
    tint: number[] = [1, 1, 1];
    center: { x: number; y: number } = { x: 0, y: 0 };

    isPointInsideMesh({ x, y }: { x: number; y: number }) {
        var inside = false;
        var vs = [
            [this.vertex[0], this.vertex[1]],
            [this.vertex[2], this.vertex[3]],
            [this.vertex[4], this.vertex[5]],
            [this.vertex[6], this.vertex[7]],
        ];
        let i;
        let j;

        for (i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            const xi = vs[i][0];
            const yi = vs[i][1];
            const xj = vs[j][0];
            const yj = vs[j][1];

            const intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
            if (intersect) inside = !inside;
        }

        return inside;
    }

    cropUV({ textureWidth, textureHeight, x, y, width, height }: RGL.Engine.Type.TextureCropArea) {
        this.uv = new Float32Array([
            x / textureWidth,
            1 - (y + height) / textureHeight,
            (x + width) / textureWidth,
            1 - (y + height) / textureHeight,
            (x + width) / textureWidth,
            1 - y / textureHeight,
            x / textureWidth,
            1 - y / textureHeight,
        ]);
    }
}
