import { LengthType } from "../../../../image/deps.ts";
import { ByteSet, ByteArray } from "../../../deps.ts";
import { RGL } from "../../../mod.ts";

export class UpdateObject extends RGL.Package.Base {
    objectList: RGL.Engine.RenderObject[];

    constructor(objectList: RGL.Engine.RenderObject[]) {
        super(RGL.Package.Type.UpdateObject);
        this.objectList = objectList;
    }

    pack(): Uint8Array {
        this.data = new ByteArray(128); // reserve 128 byte
        this.data.write.uint8(this.type); // package type

        // Check each object changes
        this.objectList.forEach((x) => {
            // Vertex change
            if (x.isVertexChanged && x.mesh) {
                this.data.write.uint16(x.id); // object id
                this.data.write.uint8(1); // vertex change
                this.data.write.int16Array(
                    new Int16Array(x.mesh.vertex.map((y) => (y * 4096) | 0)),
                    LengthType.Uint16
                ); // vertex
            }
        });

        return this.buffer;
    }
}
