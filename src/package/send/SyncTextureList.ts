import { ByteSet, LengthType } from "../../../deps.ts";
import { RGL } from "../../../mod.ts";

export class SyncTextureList extends RGL.Package.Base {
    textureList: RGL.Engine.Texture[];

    constructor(textureList: RGL.Engine.Texture[]) {
        super(RGL.Package.Type.SyncTextureList);

        this.textureList = textureList;
    }

    pack(): Uint8Array {
        let totalLength = 1 + 2; // type + amount

        // Each shader size
        this.textureList.forEach((x) => {
            totalLength += 2; // id
            totalLength += 2 + 2 + 1; // widht, height, alpha
            totalLength += 4; // texture length
            totalLength += x.buffer.length; // texture size
        });

        this.data = new ByteSet(totalLength);
        this.data.write.uint8(this.type); // package type
        this.data.write.uint16(this.textureList.length); // texture amount

        this.textureList.forEach((x) => {
            this.data.write.uint16(x.id); // texture id
            this.data.write.uint16(x.height); // texture id
            this.data.write.uint16(x.width); // texture id
            this.data.write.uint8(x.isAlpha ? 1 : 0); // texture id
            this.data.write.uint8Array(x.buffer, LengthType.Uint32); // texture data
        });

        return this.buffer;
    }
}
