// Firebase Configuration

const firebaseConfig = {
    // apiKey: "#",
    // authDomain: "#",
    // projectId: "#",
    // storageBucket: "#",
    // messagingSenderId: "#",
    // appId: "#",
    apiKey: "AIzaSyAGASAgCn9WFzXz7aBYqXTKe6Fuys7kjVI",
    authDomain: "mani-smart-manager.firebaseapp.com",
    projectId: "mani-smart-manager",
    storageBucket: "mani-smart-manager.firebasestorage.app",
    messagingSenderId: "665918801337",
    appId: "1:665918801337:web:ab8470a7a9e0247fe72268"
};

// Firebase instance
let db = null;
export let isOnline = true;

// Initialize Firebase
export function initializeFirebase() {
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        db.enablePersistence().catch(err => console.log('Persistence error:', err));
        firebase.auth().signInAnonymously().catch(err => console.log('Auth error:', err));
    } catch (e) {
        console.log('Firebase init error:', e);
    }
    return db;
}

// Get Firestore instance
export function getDb() {
    return db;
}

// Set online status
export function setOnlineStatus(status) {
    isOnline = status;
}
