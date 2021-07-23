import { ByteSet } from "../../../deps.ts";
import { RGL } from "../../../mod.ts";

// deno-lint-ignore camelcase
export type Type_ChangeTexture = {
    id: number;
    textureId: number;
};

export class SyncChangeTexture extends RGL.Package.Base {
    /*changeList: Type_ChangeTexture[];

    constructor(changeList: Type_ChangeTexture[]) {
        super(RGL.Package.Type.SyncChangeTexture);

        this.changeList = changeList;
    }

    pack(): Uint8Array {
        let totalLength = 1 + 2; // type + amount

        // Each shader size
        this.changeList.forEach((x) => {
            totalLength += 2; // id
            totalLength += 2; // texture id
        });

        this.data = new ByteSet(totalLength);
        this.data.write.uint8(this.type); // package type
        this.data.write.uint16(this.changeList.length); // Max 65536 elements

        this.changeList.forEach((x) => {
            this.data.write.uint16(x.id); // object id
            this.data.write.uint16(x.textureId); // texture id
        });

        return this.buffer;
    }*/
}
