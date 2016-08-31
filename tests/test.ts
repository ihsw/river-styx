/// <reference path="../typings/index.d.ts" />
import * as test from "tape";
import { App } from "../src/App";
import { ChildProcess } from "../src/ChildProcess";

test("App runs", (t) => {
    const app = new App();
    app.run().then((awg: ChildProcess) => {
        t.is(awg.exitCode, 0);
        t.end();
    });
});