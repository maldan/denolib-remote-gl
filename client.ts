/// <reference lib="dom" />
declare var document: HTMLDocument;

import { Client } from "./src/client/Client.ts";

(() => {
    const w = new Client();
    w.init("#glCanvas", "ws://192.168.1.92:15501");
})();
