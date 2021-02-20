import { RGL } from "./mod.ts";
// deno-lint-ignore camelcase
import { WebServer, WS_Router } from "../../../../deno_lib/web-server/mod.ts";
import { Texture } from "./src/engine/Texture.ts";

// Init http server
const web = new WebServer();
web.registerRouter(new WS_Router("api", []));
web.registerRouter(new WS_Router("", [], ["D:/deno_lib/remote-gl-client/build"]));
web.listen(15500);

// Init gl server
const app = new RGL.Server.Application();
// app.compileClientTo("./build/main.js");
app.init(15501);

const xx = new RGL.Engine.Sprite({
    width: 64,
    height: 64,
    scaleX: 0.5,
    scaleY: 0.5,
    isUseTextureResolution: true,
});
app.session.scene.add(xx);

let texturePack: Texture[] = [];
for (let i = 1200; i < 1260; i++) {
    texturePack.push(
        await app.session.scene.createTexture(`C:/Users/black/Desktop/Trash/Dragon/out_${i}.png`)
    );
}

let id = 0;
setInterval(async () => {
    // const t = new RGL.Engine.Texture(`C:/Users/black/Desktop/Trash/Dragon/out_${id++}.png`);
    // await t.load(id);
    xx.texture = texturePack[id++];
    if (id > texturePack.length - 1) {
        id = 0;
    }

    app.session.draw();
}, 1000 / (60 / 2.5));

app.event.on("update", (session) => {
    session.scene.objectFlatList.forEach((x) => {
        x.x = Math.random() / 1000;
    });

    session.sync();
    session.draw();
});
