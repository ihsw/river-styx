import * as child_process from "child_process";

export class ChildProcess {
    exitCode: number;
    exitSignal: string;
    scriptPath: string;
    isRunning: boolean;
    process: child_process.ChildProcess;

    constructor(scriptPath: string) {
        this.scriptPath = scriptPath;
    }

    run() {
        this.process = child_process.fork(this.scriptPath);
        this.isRunning = true;
    }

    send(message) {
        this.process.send(message);
    }

    async receive(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!this.isRunning) {
                reject(new Error("ChildProcess is not running!"));
                return;
            }

            this.process.on("message", (message) => {
                resolve(message);
            });
        });
    }

    disconnect() {
        if (!this.isRunning) {
            throw new Error("ChildProcess is not running!");
        }

        this.process.disconnect();
    }

    async disconnectWithTimeout(timeout: number, killSignal: string = "SIGINT"): Promise<ChildProcess> {
        return new Promise<ChildProcess>((resolve, reject) => {
            if (!this.isRunning) {
                reject(new Error("ChildProcess is not running!"));
                return;
            }

            this.process.disconnect();
            setTimeout(() => {
                if (!this.isRunning) {
                    return;
                }

                this.process.kill(killSignal);
                resolve(this.onExit());
            }, timeout);
        });
    }

    kill(signal: string) {
        this.process.kill(signal);
    }

    async onExit(): Promise<ChildProcess> {
        return new Promise<ChildProcess>((resolve, reject) => {
            if (!this.isRunning) {
                reject(new Error("ChildProcess is not running!"));
                return;
            }

            this.process.on("exit", (code: number, signal: string) => {
                this.exitCode = code;
                this.exitSignal = signal;
                resolve(this);
            });
        });
    }
}