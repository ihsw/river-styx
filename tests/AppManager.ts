/// <reference path="../typings/index.d.ts" />
import { test } from "ava";
import { AppManager } from "../src/AppManager";

test("AppManager runs", async (t) => {
    const appManager = new AppManager();
    const awg = await appManager.run();
    t.is(awg.exitCode, 0, "AWG exits with 0");
});