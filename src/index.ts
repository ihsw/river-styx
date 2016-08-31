import { AppManager } from "./AppManager";

const appManager = new AppManager();
appManager.run().then(() => {
    console.log("RAN!");
});