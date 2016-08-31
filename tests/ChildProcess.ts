/// <reference path="../typings/main.d.ts" />
import { test } from "ava";
import { ChildProcess } from "../src/ChildProcess";

test("ChildProcess runs", async (t) => {
    let childProcess = new ChildProcess(`${__dirname}/../tests-fixtures/run`);
    childProcess.run();

    childProcess = await childProcess.onExit();
    t.is(childProcess.exitCode, 0, "Exits with 0");
});

test("ChildProcess fails with 1", async (t) => {
    let childProcess = new ChildProcess(`${__dirname}/../tests-fixtures/run-fail`);
    childProcess.run();

    childProcess = await childProcess.onExit();
    t.is(childProcess.exitCode, 1, "Exits with 1");
});

test("ChildProcess disconnects", async (t) => {
    let childProcess = new ChildProcess(`${__dirname}/../tests-fixtures/disconnect`);
    childProcess.run();

    childProcess.disconnect();
    childProcess = await childProcess.onExit();
    t.is(childProcess.exitCode, 0, "Exits with 0");
});

test("ChildProcess disconnect with timeout", async (t) => {
    const startTime = process.hrtime();
    let childProcess = new ChildProcess(`${__dirname}/../tests-fixtures/disconnect-with-timeout`);
    childProcess.run();

    const expectedDuration = 2.5 * 1000;
    childProcess = await childProcess.disconnectWithTimeout(expectedDuration, "SIGINT");
    const [durationSeconds, durationMs] = process.hrtime(startTime);
    const actualDuration = durationSeconds + (durationMs / (1 * 1000 * 1000 * 1000));
    t.is(Number(actualDuration.toFixed(1)), expectedDuration / 1000, "Timeout is 2.5s");
    t.is(childProcess.exitCode, null, "Null exit code");
    t.is(childProcess.exitSignal, "SIGINT", "SIGINT exit signal");
});

test("ChildProcess is killed", async (t) => {
    let childProcess = new ChildProcess(`${__dirname}/../tests-fixtures/run`);
    childProcess.run();

    childProcess.kill("SIGINT");
    childProcess = await childProcess.onExit();
    t.is(childProcess.exitCode, null, "Null exit code");
    t.is(childProcess.exitSignal, "SIGINT", "SIGINT exit signal");
});

test("ChildProcess receives and returns a message", async (t) => {
    let childProcess = new ChildProcess(`${__dirname}/../tests-fixtures/receives-message`);
    childProcess.run();

    const greeting = "Hello, world!";
    childProcess.send(greeting);
    const response = await childProcess.receive();
    t.is(response, greeting, "Response matches message sent");
    childProcess.disconnect();

    childProcess = await childProcess.onExit();
    t.is(childProcess.exitCode, 0, "Exits with 0");
});