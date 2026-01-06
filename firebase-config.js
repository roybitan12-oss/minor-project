// Default Firebase configuration
const defaultFirebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

async function initFirebase() {
    let config = defaultFirebaseConfig;

    // Try to get config from window.APP_CONFIG which might have fetched it from the server
    if (window.APP_CONFIG) {
        const serverConfig = await window.APP_CONFIG.fetchServerConfig();
        if (serverConfig && serverConfig.firebase) {
            config = serverConfig.firebase;
        }
    }

    // Initialize Firebase if the config is filled (either from server or hardcoded default)
    if (config.apiKey !== "YOUR_API_KEY") {
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
            console.log("Firebase initialized successfully with " + (window.APP_CONFIG && window.APP_CONFIG.serverConfig ? "server" : "default") + " config!");
        }
    } else {
        console.warn("Firebase configuration not found. Please update .env or js/firebase-config.js");
    }
}

// Start initialization
initFirebase();
