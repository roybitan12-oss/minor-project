/**
 * API Configuration
 * Ensures the frontend connects to the correct server origin
 * across different development and production environments.
 */
window.APP_CONFIG = {
    // Falls back to port 3000 if running on localhost but a different port (e.g. Live Server)
    getApiUrl: function (path = '') {
        const currentOrigin = window.location.origin;
        const currentHost = window.location.hostname;
        const currentPort = window.location.port;

        let baseUrl = '';

        // Case 1: Running on localhost or 127.0.0.1 but NOT on the server port (3000)
        // This usually happens during development with VS Code Live Server (port 5500)
        if ((currentHost === 'localhost' || currentHost === '127.0.0.1') && currentPort !== '3000') {
            baseUrl = 'http://localhost:3000';
        }
        // Case 2: Opening via file:// protocol
        else if (currentOrigin === 'null' || window.location.protocol === 'file:') {
            baseUrl = 'http://localhost:3000';
        }
        // Case 3: Production or correctly configured local server
        else {
            baseUrl = currentOrigin;
        }

        // Clean up path and join
        const cleanPath = path.startsWith('/') ? path : '/' + path;
        return baseUrl + cleanPath;
    },

    // Fetches configuration from the server to avoid hardcoded keys
    fetchServerConfig: async function () {
        try {
            const response = await fetch(this.getApiUrl('/api/config'));
            if (!response.ok) throw new Error('Config fetch failed');
            this.serverConfig = await response.json();
            console.log('Server configuration loaded successfully');
            return this.serverConfig;
        } catch (err) {
            console.warn('Could not fetch server configuration, using defaults:', err);
            return null;
        }
    },

    serverConfig: null
};
