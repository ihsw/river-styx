/// <reference path="../typings/index.d.ts" />
import * as test from "tape";
import { AppManager } from "../src/AppManager";
import { ChildProcess } from "../src/ChildProcess";

test("AppManager runs", (t) => {
    const appManager = new AppManager();
    appManager.run().then((awg: ChildProcess) => {
        t.is(awg.exitCode, 0, "AWG exits with 0");
        t.end();
    });
});