import { app, BrowserWindow, shell } from "electron";
import path, {dirname} from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

let mainWindow: BrowserWindow | null = null;

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    // Handle OAuth callback redirects
    mainWindow.webContents.on('will-navigate', (event, url) => {
        handleOAuthCallback(url);
    });

    // Handle external link clicks - open in default browser
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        // If it's an OAuth URL, handle it specially
        if (url.includes('/api/v1/auth/login/google')) {
            shell.openExternal(url);
            return { action: 'deny' };
        }
        
        // For other external links, open in default browser
        if (url.startsWith('http://') || url.startsWith('https://')) {
            shell.openExternal(url);
            return { action: 'deny' };
        }
        
        return { action: 'allow' };
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

// Handle OAuth callback URLs
function handleOAuthCallback(url: string) {
    if (url.includes('/auth/callback')) {
        console.log('OAuth callback detected:', url);
        // The URL already contains the callback route and parameters
        // Just let it load normally in the main window
    }
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        // Recreate window
        app.emit('ready');
    }
});