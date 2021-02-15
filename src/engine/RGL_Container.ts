import { Matrix2D } from "../../../geom/mod.ts";
// deno-lint-ignore camelcase
import { RGL_Camera } from "./RGL_Camera.ts";
// deno-lint-ignore camelcase
import { RGL_Object } from "./RGL_Object.ts";
// deno-lint-ignore camelcase
import { RGL_Scene } from "./RGL_Scene.ts";

// deno-lint-ignore camelcase
export class RGL_Container extends RGL_Object {
    isDrawable = false;

    update(parent: Matrix2D) {
        // Calculate matrix
        this.matrix.identity();
        this.matrix.concat(parent);
        this.matrix.translate(this.x, this.y, 0.1);
        this.matrix.rotate(-this.rotation);
        this.matrix.scale(this.scaleX, this.scaleY, 1);

        this.isChanged = false;
        for (let i = 0; i < this.objectList.length; i++) {
            this.objectList[i].update(this.matrix);
            if (this.objectList[i].isChanged) {
                this.isChanged = true;
            }
        }
    }
}
