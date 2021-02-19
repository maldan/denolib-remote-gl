import { ByteSet, LengthType } from "../../deps.ts";
import { RGL } from "../../mod.ts";

export class SyncShaderList extends RGL.Package.Base {
    shaderList: RGL.Engine.Shader[];

    constructor(shaderList: RGL.Engine.Shader[]) {
        super(RGL.Package.Type.SyncShaderList);

        this.shaderList = shaderList;
    }

    static from(data: ByteSet): SyncShaderList {
        const list = [];
        const amount = data.read.uint8();

        for (let i = 0; i < amount; i++) {
            list.push(
                new RGL.Engine.Shader({
                    id: data.read.uint8(),
                    vertex: data.read.string(LengthType.Uint16),
                    fragment: data.read.string(LengthType.Uint16),
                })
            );
        }
        return new SyncShaderList(list);
    }

    pack(): Uint8Array {
        let totalLength = 1 + 1; // type + amount

        // Each shader size
        this.shaderList.forEach((x) => {
            totalLength += 1; // id
            totalLength += 4 + x.vertex.length; // len + string len
            totalLength += 4 + x.fragment.length; // len + string len
        });

        this.data = new ByteSet(totalLength);
        this.data.write.uint8(this.type); // package type
        this.data.write.uint8(this.shaderList.length); // shader amount

        this.shaderList.forEach((x) => {
            this.data.write.uint8(x.id); // shader id
            this.data.write.string(x.vertex, LengthType.Uint16); // vertex shader
            this.data.write.string(x.fragment, LengthType.Uint16); // fragment shader
        });

        return this.buffer;
    }
}
