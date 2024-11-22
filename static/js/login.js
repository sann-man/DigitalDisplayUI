// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";

import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcSw5c9s_kIIk6lkW2-mgEHKxyxto6UpU",
  authDomain: "digital-display-app-5984f.firebaseapp.com",
  projectId: "digital-display-app-5984f",
  storageBucket: "digital-display-app-5984f.firebasestorage.app",
  messagingSenderId: "460419726217",
  appId: "1:460419726217:web:ec7630d3df7944079fbf58",
  measurementId: "G-X2YW3EEGMK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);



// submit

const submit = document.getElementById('submit'); 

const auth = getAuth(app);

submit.addEventListener("click", function (event){ 

    // inputs

    const email = document.getElementById('email').value; 
    const password = document.getElementById('password').value;
    
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        window.location.href = '/main'; 
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage); 
      });
}) 