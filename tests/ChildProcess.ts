/// <reference path="../typings/index.d.ts" />
import * as test from "tape";
import { ChildProcess } from "../src/ChildProcess";

test("ChildProcess runs", (t) => {
    const childProcess = new ChildProcess(`${__dirname}/../tests-fixtures/run`);
    childProcess.run();
    childProcess.onExit().then((childProcess: ChildProcess) => {
        t.is(childProcess.exitCode, 0);
        t.end();
    }).catch((err: Error) => {
        t.is(err, null);
        t.end();
    });
});

test("ChildProcess fails with 1", (t) => {
    const childProcess = new ChildProcess(`${__dirname}/../tests-fixtures/run-fail`);
    childProcess.run();
    childProcess.onExit().then((childProcess: ChildProcess) => {
        t.is(childProcess.exitCode, 1);
        t.end();
    }).catch((err: Error) => {
        t.is(err, null);
        t.end();
    });
});

test("ChildProcess disconnects", (t) => {
    const childProcess = new ChildProcess(`${__dirname}/../tests-fixtures/disconnect`);
    childProcess.run();
    childProcess.disconnect();
    childProcess.onExit().then((childProcess: ChildProcess) => {
        t.is(childProcess.exitCode, 0);
        t.end();
    }).catch((err: Error) => {
        t.is(err, null);
        t.end();
    });
});

test("ChildProcess disconnect with timeout", (t) => {
    const startTime = process.hrtime();
    const childProcess = new ChildProcess(`${__dirname}/../tests-fixtures/disconnect-with-timeout`);
    childProcess.run();

    const expectedDuration = 2.5 * 1000;
    childProcess.disconnectWithTimeout(expectedDuration, "SIGINT").then((childProcess) => {
        const [durationSeconds, durationMs] = process.hrtime(startTime);
        const actualDuration = durationSeconds + (durationMs / (1 * 1000 * 1000 * 1000));

        t.is(actualDuration, expectedDuration);
        t.is(childProcess.exitCode, null);
        t.is(childProcess.exitSignal, "SIGINT");
        t.end();
    }).catch((err: Error) => {
        t.is(err, null);
        t.end();
    });
});