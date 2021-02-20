import { RGL } from "./mod.ts";
// deno-lint-ignore camelcase
import { WebServer, WS_Router } from "../../../../deno_lib/web-server/mod.ts";
import { Sprite } from "./src/engine/Sprite.ts";

// Init http server
const web = new WebServer();
web.registerRouter(new WS_Router("api", []));
web.registerRouter(new WS_Router("", [], ["D:/deno_lib/remote-gl-client/build"]));
web.listen(15500);

// Init gl server
const app = new RGL.Server.Application();
// app.compileClientTo("./build/main.js");
app.init(15501);

app.session.scene.add(new Sprite({ width: 32, height: 32 }));
