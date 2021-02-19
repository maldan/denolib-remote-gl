import { ByteSet, LengthType } from "../../../client.deps.ts";
// deno-lint-ignore camelcase
import { RGL_Shader } from "../../engine/RGL_Shader.ts";
// deno-lint-ignore camelcase
import { RGL_PackageType } from "../RGL_Package.ts";
// deno-lint-ignore camelcase
import { Package_Base } from "./Package_Base.ts";

// deno-lint-ignore camelcase
export class Package_SyncDelete extends Package_Base {
    objectList: number[] = [];

    constructor(objectList: number[]) {
        super(RGL_PackageType.SyncDelete);

        this.objectList = objectList;
    }

    static from(data: ByteSet): Package_SyncDelete {
        const list = [];
        const amount = data.read.uint16();

        for (let i = 0; i < amount; i++) {
            list.push(data.read.uint16());
        }

        return new Package_SyncDelete(list);
    }

    pack(): Uint8Array {
        let totalLength = 1 + 2; // type + amount

        // Each shader size
        this.objectList.forEach((x) => {
            totalLength += 2; // id
        });

        this.data = new ByteSet(totalLength);
        this.data.write.uint8(this.type); // package type
        this.data.write.uint16(this.objectList.length); // object list max 65536

        this.objectList.forEach((x) => {
            this.data.write.uint16(x); // object id
        });

        return this.buffer;
    }
}
