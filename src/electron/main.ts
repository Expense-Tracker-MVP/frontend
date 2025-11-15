import { app, BrowserWindow, shell } from "electron";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

let mainWindow: BrowserWindow | null = null;

// Whitelist of allowed URLs for OAuth and internal navigation
function isAllowedUrl(urlString: string): boolean {
    try {
        const url = new URL(urlString);
        const backendUrl = process.env.VITE_PUBLIC_BACKEND_URL;
        const frontendUrl = process.env.VITE_PUBLIC_FRONTEND_URL;

        if (!backendUrl || !frontendUrl) {
            throw new Error("Missing environment variables");
        }

        // Allow backend OAuth endpoints
        if (url.origin === new URL(backendUrl).origin) {
            return url.pathname.startsWith('/api/v1/auth/') ||
                url.pathname.startsWith('/oauth2/');
        }

        // Allow frontend callback route
        if (url.origin === new URL(frontendUrl).origin || urlString.startsWith('file://')) {
            return url.pathname.includes('/auth/callback');
        }

        // Allow Google OAuth domains
        const allowedDomains = ['accounts.google.com', 'oauth2.googleapis.com'];
        return allowedDomains.includes(url.hostname);
    } catch {
        return false;
    }
}

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
    // But allow OAuth flow to happen in the main window
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        // For OAuth and internal navigation, allow in main window
        if (isAllowedUrl(url)) {
            return { action: 'allow' };
        }

        // For other external links, open in default browser
        if (url.startsWith('http://') || url.startsWith('https://')) {
            shell.openExternal(url);
            return { action: 'deny' };
        }

        return { action: 'allow' };
    });

    if (process.env.NODE_ENV === 'development') {
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