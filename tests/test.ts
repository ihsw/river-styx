/// <reference path="../typings/index.d.ts" />
import * as request from "supertest";
import * as HttpStatus from "http-status";
import { server as app } from "../src/app";
import { test, ContextualTestContext } from "ava";

const errorCallback = (t: ContextualTestContext, err: Error, msg: string) => {
    t.is(err, null, msg);
};

const testRequest = (t: ContextualTestContext, url: string, status: number, body: string, message: string) => {
    request(app)
        .get(url)
        .expect(status)
        .expect(body)
        .end((err, res) => errorCallback(t, err, message));
};

test(
    "Homepage Should fail with NOT_FOUND",
    (t) => testRequest(t, "/", HttpStatus.NOT_FOUND, "FOUR OH FOUR!", "GET / failed")
);

test(
    "AWG Should return AWG",
    (t) => testRequest(t, "/awg", HttpStatus.OK, "AWG", "GET /awg failed")
);

test(
    "OFC Should return OFC",
    (t) => testRequest(t, "/ofc", HttpStatus.OK, "OFC", "GET /ofc failed")
);