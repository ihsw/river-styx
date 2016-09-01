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
        if (!this.isRunning) {
            throw new Error("Child process is not running!");
        }

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

    async disconnect(): Promise<ChildProcess> {
        if (!this.isRunning) {
            throw new Error("ChildProcess is not running!");
        }

        this.process.disconnect();
        return this.onExit();
    }

    async disconnectWithTimeout(timeout: number, killSignal: string = "SIGINT"): Promise<ChildProcess> {
        return new Promise<ChildProcess>((resolve, reject) => {
            if (!this.isRunning) {
                reject(new Error("ChildProcess is not running!"));
                return;
            }

            let shouldBailHard = true;
            this.process.disconnect();
            this.onExit().then((updatedChildProcess: ChildProcess) => {
                shouldBailHard = false;
                resolve(updatedChildProcess);
            }).catch(reject);
            setTimeout(() => {
                if (!shouldBailHard) {
                    return;
                }

                this.kill(killSignal).then(resolve, reject);
            }, timeout);
        });
    }

    kill(signal: string): Promise<ChildProcess> {
        if (!this.isRunning) {
            throw new Error("ChildProcess is not running!");
        }

        this.process.kill(signal);
        return this.onExit();
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
                this.isRunning = false;
                resolve(this);
            });
        });
    }
}