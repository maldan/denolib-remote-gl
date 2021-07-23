import { ByteSet } from "../../../deps.ts";
import { RGL } from "../../../mod.ts";

export class DeleteTexture extends RGL.Package.Base {
    textureList: RGL.Engine.Texture[] = [];

    constructor(textureList: RGL.Engine.Texture[]) {
        super(RGL.Package.Type.DeleteTexture);

        this.textureList = textureList;
    }

    pack(): Uint8Array {
        let totalLength = 1 + 2; // type + amount

        // Each shader size
        this.textureList.forEach((x) => {
            totalLength += 2; // id
        });

        this.data = new ByteSet(totalLength);
        this.data.write.uint8(this.type); // package type
        this.data.write.uint16(this.textureList.length); // object list max 65536

        this.textureList.forEach((x) => {
            this.data.write.uint16(x.id); // object id
        });

        return this.buffer;
    }
}
