import { Matrix2D } from "../../server.deps.ts";

// deno-lint-ignore camelcase
export class RGL_Camera {
    matrix: Matrix2D = new Matrix2D();

    width = 0;
    height = 0;
    zoom = 1;
    rotation = 0;
    x = 0;
    y = 0;
    z = 0;

    private _toWorldMatrix: Matrix2D = new Matrix2D();

    update() {
        const totalWidth = (2 / this.width) * this.zoom;
        const totalHeight = (2 / this.height) * this.zoom;

        this.matrix.identity();
        this.matrix.translate(this.x * totalWidth, this.y * totalHeight, this.z);

        this.matrix.scale(totalWidth, totalHeight, 0.01);
        this.matrix.rotate(-this.rotation);
    }

    toWorldPosition({ x, y }: { x: number; y: number }): { x: number; y: number } {
        this._toWorldMatrix.identity();
        this._toWorldMatrix.concat(this.matrix);
        this._toWorldMatrix.translate(x, y, 0);
        const raw = this._toWorldMatrix.matrix;

        return {
            x: raw[0] + raw[4] + raw[12] - 1,
            y: raw[1] + raw[5] + raw[13] - 1,
        };
    }
}
