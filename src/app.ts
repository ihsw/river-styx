/// <reference path="../typings/index.d.ts" />
import { ChildProcess } from "./ChildProcess";

export class App {
    async run(): Promise<ChildProcess> {
        let awg = new ChildProcess(`${__dirname}/awg`);
        awg.run();

        awg = await awg.onExit();
        return awg;
    }
}