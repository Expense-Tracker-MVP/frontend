import { app, BrowserWindow } from "electron";
import path, {dirname} from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    if (process.env.NODE_ENV === 'development') {
        console.log('Loading URL for development');
        mainWindow.loadURL('http://localhost:5173');
    }
    else {
        mainWindow.loadFile(path.join(__dirname, '../dist-react/index.html'))
            .catch(err => {
                console.error('Failed to load index.html:', err);
            });
    }
});