/// <reference path="../typings/main.d.ts" />
import { test } from "ava";
import * as supertest from "supertest";
import * as HttpStatus from "http-status";
import { WebFrontend } from "../src/WebFrontend";
import { ChildProcess } from "../src/ChildProcess";

test.cb("Blank WebFrontend should return NOT_FOUND", (t) => {
    const webFrontend = new WebFrontend();
    const request = supertest(webFrontend.app);
    request.get("/")
        .end((err: Error, res: supertest.Response) => {
            t.is(res.status, HttpStatus.NOT_FOUND, "Response code is NOT_FOUND");
            t.end();
        });
});

test.cb("WebFrontend should load basic route", (t) => {
    const webFrontend = new WebFrontend();

    const childProcess = new ChildProcess("../tests-fixtures/express-response");
    webFrontend.loadRoute("/greeting", childProcess);

    const request = supertest(webFrontend.app);
    request.get("/greeting")
        .end((err: Error, res: supertest.Response) => {
            t.is(res.text, "Hello, world!", "Response text is standard greeting");
            t.end();
        });
});