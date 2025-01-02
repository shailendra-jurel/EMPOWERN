import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// import { getAnalytics } from "firebase/analytics";
// import firebase from 'firebase/app';      // Import core Firebase functionality

const firebaseConfig = {
    apiKey: "AIzaSyAt1BB8CPD6XK584jtt0-hgd_uykNoS_XM",
    authDomain: "empowernfirebase.firebaseapp.com",
    projectId: "empowernfirebase",
    storageBucket: "empowernfirebase.firebasestorage.app",
    messagingSenderId: "777599786680",
    appId: "1:777599786680:web:337391005b62b83e659e4d",
    measurementId: "G-QYS8XTX4R0"
};

// Initialize Firebase


// if (!firebase.apps.length) {
    //    const app = initializeApp(firebaseConfig); 
    //   } else {
        //     firebase.app();  
        //   }
     //   const app = !firebase.apps.length ? initializeApp(firebaseConfig) : firebase.app();
        // const analytics = getAnalytics(app);


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);


// export default firebase;    