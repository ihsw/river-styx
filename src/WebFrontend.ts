/// <reference path="../typings/index.d.ts" />
import * as express from "express";
import * as supertest from "supertest";
import { ChildProcess } from "./ChildProcess";

interface IRoutes {
    [routePrefix: string]: ChildProcess;
}

export interface IHttpMessage {
    url: string;
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
        this.app.all(routePrefix, (req: express.Request, res: express.Response) => {
            // serializing and forwarding the request to the child-process route handler
            const url = req.url.substr(routePrefix.length);
            const requestMessage: IHttpMessage = {
                url: url
            };
            childProcess.send(requestMessage);

            // handling the response
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