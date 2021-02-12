// deno-lint-ignore camelcase
import { GL_Client } from "./GL_Client.ts";
// deno-lint-ignore camelcase
import { GL_ClientObject } from "./GL_ClientObject.ts";
// deno-lint-ignore camelcase
import { GL_Material } from "./GL_Material.ts";

// deno-lint-ignore camelcase
export class GL_Render {
    material: GL_Material[] = [];
    objectList: GL_ClientObject[] = [];

    private _gl!: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext) {
        this._gl = gl;
    }

    draw() {
        const gl = this._gl;

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        for (let i = 0; i < this.objectList.length; i++) {
            const obj = this.objectList[i];
            const material = this.material[obj.shaderId];

            // Enable smooth if fps lower than 60
            /*if (GL_Client.frameRate < 60) {
                obj.update();
            }*/

            // Use shader
            gl.useProgram(material.program);

            // Bind texture
            if (obj.texture && obj.texture.texture) {
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, obj.texture.texture);
                gl.uniform1i(material.uniform["uTexture"], 0);
            }

            // Bind index
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.index);

            // Bind vertex
            gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertex);
            gl.enableVertexAttribArray(material.attribute["aPosition"]);
            gl.vertexAttribPointer(material.attribute["aPosition"], 2, gl.FLOAT, false, 0, 0);

            // Bind uv
            gl.bindBuffer(gl.ARRAY_BUFFER, obj.uv);
            gl.enableVertexAttribArray(material.attribute["aUV"]);
            gl.vertexAttribPointer(material.attribute["aUV"], 2, gl.FLOAT, false, 0, 0);

            // Bind color
            gl.uniform3fv(material.uniform["uTint"], obj.tint);

            // Draw
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        }

        /*gl.bindBuffer(gl.ARRAY_BUFFER, buffers);
        gl.vertexAttribPointer(this._aVertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this._aVertexPosition);

        gl.useProgram(program);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);*/
    }
}
