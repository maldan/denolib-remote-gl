// deno-lint-ignore camelcase
import { RGL_Object } from "./RGL_Object.ts";

// deno-lint-ignore camelcase
export class RGL_Container {
    objectList: RGL_Object[] = [];

    add(object: RGL_Object) {
        this.objectList.push(object);
    }

    delete(object: RGL_Object) {
        const index = this.objectList.indexOf(object);
        if (index !== -1) {
            object.isDeleted = true;
            this.objectList.splice(index, 1);
        }
    }
}
