import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { app } from "./userRepository.js";

const auth = getAuth();

const logInBtn = document.getElementById("buttonLogin");
logInBtn.addEventListener('click', (e) => {
  var email = document.getElementById('form2Example1').value;
  var password = document.getElementById('form2Example2').value;

  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    //console.log(user.uid);
    //alert('User logged in!');
    window.sessionStorage.setItem(`email`,email);
    window.location.href=`admin.html`
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert('Invalid email and password!');
  });

})
