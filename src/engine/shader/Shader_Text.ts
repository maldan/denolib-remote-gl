// deno-lint-ignore camelcase
import { RGL_Shader } from "../RGL_Shader.ts";

// deno-lint-ignore camelcase
export class Shader_Text extends RGL_Shader {
    id = 2;
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

        float median(float r, float g, float b) {
            return max(min(r, g), min(max(r, g), b));
        }

        void main() {
            vec4 textureColor = texture2D(uTexture, vUV);
            float sigDist = median(textureColor.r, textureColor.g, textureColor.b);
            float alpha = step(0.5, sigDist);
            gl_FragColor = vec4(uTint, alpha);
            if (gl_FragColor.a < 0.0001) discard;
        }
    `;
}
