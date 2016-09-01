/// <reference path="../typings/index.d.ts" />
import * as supertest from "supertest";
import * as express from "express";
import { IHttpMessage } from "../src/WebFrontend";

// define app
const app = express();
app.get("/", (req, res) => res.send("Hello, world!"));

// set up request handler
const request = supertest(app);

process.on("message", (message: IHttpMessage) => {
    request.get(message.url).end((err: Error, res: supertest.Response) => {
        process.send(res);
    });
});