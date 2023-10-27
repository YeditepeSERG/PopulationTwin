import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import {createUser} from "./userRepository.js"

const registerBtn = document.getElementById("buttonRegister");

function createViewer(email, password){
  return new Promise((resolve,reject) => {
    const auth = getAuth();
  
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      resolve(`${user} is added.`)
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      reject(errorMessage);
    });
  })
}

registerBtn.addEventListener('click', async (e) => {
    let email = document.getElementById('form2Example1').value;
    let password = document.getElementById('form2Example2').value;

    createViewer(email, password)
    .then(()=>{
      createUser(email, [], [])
      .then((message) => {
        alert(message);
        document.getElementById('form2Example1').value = "";
        document.getElementById('form2Example2').value = "";
      })
    })
})
  