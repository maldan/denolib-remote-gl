/// <reference lib="dom" />

// deno-lint-ignore camelcase
export class GL_Texture {
    texture: WebGLTexture;
    url = "";
    private _gl!: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext, url: string) {
        this._gl = gl;
        this.texture = gl.createTexture() as WebGLTexture;
        this.url = url;
    }

    load() {
        const gl = this._gl;

        // deno-lint-ignore no-undef
        const image = new Image();
        image.src = this.url;

        return new Promise((resolve, reject) => {
            image.onload = (): void => {
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                /*gl.texImage2D(
                    gl.TEXTURE_2D,
                    0,
                    gl.RGBA,
                    image.width,
                    image.height,
                    0,
                    gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    null
                );*/
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

                gl.bindTexture(gl.TEXTURE_2D, null);
                resolve(null);
            };
            image.onerror = (e): void => {
                reject(e);
            };
        });
    }
}
