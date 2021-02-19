import { ByteSet, LengthType } from "../../../client.deps.ts";
// deno-lint-ignore camelcase
import { RGL_Shader } from "../../engine/RGL_Shader.ts";
// deno-lint-ignore camelcase
import { RGL_PackageType } from "../RGL_Package.ts";
// deno-lint-ignore camelcase
import { Package_Base } from "./Package_Base.ts";

// deno-lint-ignore camelcase
export class Package_SyncShaderList extends Package_Base {
    shaderList: RGL_Shader[];

    constructor(shaderList: RGL_Shader[]) {
        super(RGL_PackageType.SyncShaderList);

        this.shaderList = shaderList;
    }

    static from(data: ByteSet): Package_SyncShaderList {
        const list = [];
        const amount = data.read.uint8();

        for (let i = 0; i < amount; i++) {
            list.push(
                new RGL_Shader({
                    id: data.read.uint8(),
                    vertex: data.read.string(LengthType.Uint16),
                    fragment: data.read.string(LengthType.Uint16),
                })
            );
        }
        return new Package_SyncShaderList(list);
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
