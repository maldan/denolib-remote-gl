/// <reference lib="dom" />
declare var document: HTMLDocument;

// deno-lint-ignore camelcase
import { RGL_Client } from "./src/client/RGL_Client.ts";

(() => {
    const w = new RGL_Client();
    w.init("#glCanvas", "ws://192.168.1.92:15501");
})();
