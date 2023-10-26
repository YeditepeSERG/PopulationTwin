import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import {createUser} from "./userRepository.js"

const registerBtn = document.getElementById("buttonRegister");

function createViewer(email, password){
    const auth = getAuth();
  
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

registerBtn.addEventListener('click', async (e) => {
    let email = document.getElementById('form2Example1').value;
    let password = document.getElementById('form2Example2').value;

    createViewer(email, password);
    await createUser(email, [], []);
})
  