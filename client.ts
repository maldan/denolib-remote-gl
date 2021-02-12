/// <reference lib="dom" />
declare var document: HTMLDocument;

// deno-lint-ignore camelcase
import { GL_Client } from "./src/client/GL_Client.ts";

(() => {
    const w = new GL_Client();
    w.init("#glCanvas", "ws://192.168.1.92:15501");
})();
