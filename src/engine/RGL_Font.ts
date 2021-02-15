import { FileSystem } from "../../server.deps.ts";
// deno-lint-ignore camelcase
import { Type_TextureCropArea } from "./RGL_Mesh.ts";

// deno-lint-ignore camelcase
export type Type_GlyphInfo = {
    unicode: number;
    advance: number;
    planeBounds: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
    atlasBounds: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
    width: number;
    height: number;
};

// deno-lint-ignore camelcase
export type Type_FontInfo = {
    atlas: {
        width: number;
        height: number;
    };
    glyphs: Type_GlyphInfo[];
};

// deno-lint-ignore camelcase
export class RGL_Font {
    private _url: string;

    textureWidth = 0;
    textureHeight = 0;

    private _glyphList: { [x: string]: Type_GlyphInfo } = {};

    /**
     * Load msdf font
     * @param {string} url
     */
    constructor(url: string) {
        this._url = url;
    }

    async load() {
        const fontInfo = await FileSystem.file.readJSON<Type_FontInfo>(this._url + ".json");
        if (!fontInfo) {
            throw new Error("Font not found!");
        }

        // Set texture size
        this.textureWidth = fontInfo.atlas.width;
        this.textureHeight = fontInfo.atlas.height;

        // Fill glyph info
        for (let i = 0; i < fontInfo.glyphs.length; i++) {
            const glyph = fontInfo.glyphs[i];
            if (!glyph.atlasBounds) {
                continue;
            }

            // Calculate glyph size
            glyph.width = glyph.atlasBounds.right - glyph.atlasBounds.left;
            glyph.height = glyph.atlasBounds.top - glyph.atlasBounds.bottom;

            glyph.atlasBounds.bottom = this.textureHeight - glyph.atlasBounds.bottom;
            glyph.atlasBounds.top = this.textureHeight - glyph.atlasBounds.top;

            this._glyphList[String.fromCharCode(glyph.unicode)] = glyph;
        }
    }

    getGlyphInfo(char: string): Type_GlyphInfo {
        return this._glyphList[char];
    }

    getGlyphArea(char: string): Type_TextureCropArea | null {
        const info = this._glyphList[char];
        if (!info) return null;
        return {
            textureWidth: this.textureWidth,
            textureHeight: this.textureHeight,
            width: info.width,
            height: info.height,
            x: info.atlasBounds.left,
            y: info.atlasBounds.top,
        };
    }

    get textureUrl(): string {
        return this._url + ".png";
    }
}
