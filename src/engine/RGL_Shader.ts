// deno-lint-ignore camelcase
export class RGL_Shader {
    id = 1;
    vertex = `
        attribute vec2 aPosition;
        attribute vec2 aUV;

        varying lowp vec2 vUV;

        void main() {
            vUV = aUV;
            gl_Position = vec4(aPosition, 0.1, 1.0);
        }
    `;
    fragment = `
        precision mediump float;
        varying lowp vec2 vUV;

        uniform vec3 uTint;
        uniform sampler2D uTexture;

        void main() {
            gl_FragColor = texture2D(uTexture, vUV) * vec4(uTint, 1.0);
            // gl_FragColor = vec4(uTint, 1.0);
        }
    `;

    constructor({
        id,
        vertex,
        fragment,
    }: { id?: number; vertex?: string; fragment?: string } = {}) {
        this.id = id ?? this.id;
        this.vertex = vertex ?? this.vertex;
        this.fragment = fragment ?? this.fragment;
    }
}
