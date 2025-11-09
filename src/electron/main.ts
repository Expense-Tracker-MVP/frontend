import { app, BrowserWindow } from "electron";
import path from "path";

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        }
    });
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"))
        .catch(err => {
            console.error('Failed to load index.html:', err);
        });
});