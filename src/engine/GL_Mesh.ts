// deno-lint-ignore camelcase
export class GL_Mesh {
    index: number[] = [0, 1, 2, 0, 2, 3];
    vertex: number[] = [-0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5];
    uv: number[] = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];
    tint: number[] = [1, 1, 1];

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
}
