import { assertEquals } from "https://deno.land/std@0.87.0/testing/asserts.ts";
import { ByteSet } from "../../bytearray/mod.ts";

import { RGL } from "../mod.ts";

Deno.test("package test", () => {
    assertEquals(new RGL.Package.Init().type, RGL.Package.Type.Init);
    assertEquals(new RGL.Package.ResizeScreen(32, 32).type, RGL.Package.Type.ResizeScreen);
    assertEquals(new RGL.Package.SyncAdd([]).type, RGL.Package.Type.SyncAdd);
    assertEquals(new RGL.Package.SyncDelete([]).type, RGL.Package.Type.SyncDelete);
    assertEquals(new RGL.Package.SyncChangeVertex([]).type, RGL.Package.Type.SyncChangeVertex);
    assertEquals(new RGL.Package.SyncObjectList([]).type, RGL.Package.Type.SyncObjectList);
    assertEquals(new RGL.Package.SyncShaderList([]).type, RGL.Package.Type.SyncShaderList);
    assertEquals(new RGL.Package.UserEventKeyDown("2", 2).type, RGL.Package.Type.UserEventKeyDown);
    assertEquals(new RGL.Package.UserEventKeyUp("2", 2).type, RGL.Package.Type.UserEventKeyUp);
});

Deno.test("package init", () => {
    const p = new RGL.Package.Init().pack();
    const b = ByteSet.from(p);
    assertEquals(b.buffer.length, 1);
    assertEquals(b.read.uint8(), RGL.Package.Type.Init);
});

Deno.test("package resize screen", () => {
    const p = new RGL.Package.ResizeScreen(320, 240).pack();
    const b = ByteSet.from(p);
    assertEquals(b.buffer.length, 5);
    assertEquals(b.read.uint8(), RGL.Package.Type.ResizeScreen);
    assertEquals(b.read.uint16(), 320);
    assertEquals(b.read.uint16(), 240);
});
