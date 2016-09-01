/// <reference path="../typings/index.d.ts" />
import * as express from "express";
import * as supertest from "supertest";
import { ChildProcess } from "./ChildProcess";

interface IRoutes {
    [routePrefix: string]: ChildProcess;
}

export class WebFrontend {
    app: express.Application;
    routes: IRoutes;

    constructor() {
        this.app = express();
        this.routes = {};
    }

    loadRoute(routePrefix: string, childProcess: ChildProcess) {
        this.routes[routePrefix] = childProcess;

        childProcess.run();
        this.app.all(routePrefix, (req, res) => {
            childProcess.send(req);
            childProcess.receive().then((message: supertest.Response) => {
                res.send(message.text);
            });
        });
    }

    unloadRoute(routePrefix: string): Promise<ChildProcess> {
        if (!(routePrefix in this.routes)) {
            throw new Error(`Route ${routePrefix} could not be found!`);
        }

        const route = this.routes[routePrefix];
        route.disconnect();
        return route.onExit();
    }
}