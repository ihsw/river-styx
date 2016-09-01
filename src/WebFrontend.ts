/// <reference path="../typings/index.d.ts" />
import * as express from "express";

export class WebFrontend {
    app: express.Application;

    constructor() {
        this.app = express();
    }
}