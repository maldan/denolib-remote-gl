import { Image } from "../../deps.ts";

export class Texture {
    id = 0;
    isInit = false;
    isLoaded = false;
    hasAlpha = false;
    isDestroyed = false;
    width = 0;
    height = 0;
    path: string;

    private _buffer!: Uint8Array;

    constructor(path: string) {
        this.path = path;
    }

    async load() {
        if (this.isInit) {
            return;
        }
        this.isInit = true;

        // Read data
        this._buffer = await Deno.readFile(this.path);

        const info = await Image.info(this.path);
        this.width = info.width;
        this.height = info.height;
        this.hasAlpha = info.hasAlpha;

        // Set is loaded
        this.isLoaded = true;
    }

    async update(path: string) {
        this.path = path;
        this._buffer = await Deno.readFile(this.path);
    }

    destroy() {
        this.isDestroyed = true;
    }

    get buffer() {
        return this._buffer;
    }
}
