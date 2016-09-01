/// <reference path="../typings/main.d.ts" />
import { test } from "ava";
import * as supertest from "supertest";
import * as HttpStatus from "http-status";
import { WebFrontend } from "../src/WebFrontend";

test.cb("Blank WebFrontend should return NOT_FOUND", (t) => {
    const webFrontend = new WebFrontend();
    const request = supertest(webFrontend.app);
    request.get("/")
        .end((err: Error, res: supertest.Response) => {
            t.is(res.status, HttpStatus.NOT_FOUND);
            t.end();
        });
});