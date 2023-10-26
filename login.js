import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBYsmw1O8aEU9SnMPqwS4CNvaaRrLem-nI",
  authDomain: "populationtwin.firebaseapp.com",
  databaseURL: "https://populationtwin-default-rtdb.firebaseio.com",
  projectId: "populationtwin",
  storageBucket: "populationtwin.appspot.com",
  messagingSenderId: "155599784115",
  appId: "1:155599784115:web:44434bcf2eedb72c13c8c6",
  measurementId: "G-QZH8VMQ93P",
}

export const app = initializeApp(firebaseConfig);
const auth = getAuth();

buttonLogin.addEventListener('click', (e) => {
  var email = document.getElementById('form2Example1').value;
  var password = document.getElementById('form2Example2').value;

  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log(user.uid);
    alert('User logged in!');
    window.sessionStorage.setItem(`email`,email);
    window.location.href=`admin.html`
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert('Invalid email and password!');
  });
});