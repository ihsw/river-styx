import { App } from "./App";

const app = new App();
app.run().then(() => {
    console.log("RAN!");
});