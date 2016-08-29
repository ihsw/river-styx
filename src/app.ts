/// <reference path="../typings/index.d.ts" />
import * as http from "http";
import * as express from "express";

// apps
const awg = express();
awg.get("/awg", (req, res) => res.send("AWG"));
const ofc = express();
ofc.get("/ofc", (req, res) => res.send("OFC"));
const miss = express();
miss.all("*", (req, res) => res.status(404).send("FOUR OH FOUR!"));

// app multiplexer
const appMap = {
    "/awg": awg,
    "/ofc": ofc
};
const multiplexer = (req: express.Request, res: express.Response) => {
    for (const prefix in appMap) {
        if (req.url.startsWith(prefix)) {
            return appMap[prefix](req, res);
        }
    }

    miss(req, res, null);
};

export const server = http.createServer(multiplexer);