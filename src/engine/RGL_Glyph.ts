// deno-lint-ignore camelcase
import { RGL_Font } from "../../mod.ts";
// deno-lint-ignore camelcase
import { RGL_Shader } from "./RGL_Shader.ts";
// deno-lint-ignore camelcase
import { RGL_Sprite } from "./RGL_Sprite.ts";
// deno-lint-ignore camelcase
import { Shader_Text } from "./shader/Shader_Text.ts";

// deno-lint-ignore camelcase
export class RGL_Glyph extends RGL_Sprite {
    shader: RGL_Shader = new Shader_Text();

    constructor(char: string, font: RGL_Font) {
        super(1, 1, font.textureUrl);

        this.width = font.getGlyphInfo(char).width;
        this.height = font.getGlyphInfo(char).height;

        const area = font.getGlyphArea(char);
        if (area) {
            this.mesh.cropUV(area);
        }
    }
}
