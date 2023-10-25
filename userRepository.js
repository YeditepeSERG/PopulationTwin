import { app } from "./login.js";
import { addDoc, collection, getFirestore, getDocs, deleteDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";


const db = getFirestore(app);

async function createUser(email, view_list, edit_list){
    console.log(view_list)
    try {
        const docRef = await addDoc(collection(db, "users"), {
          email: email,
          view_list: view_list,
          edit_list: edit_list,
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}

async function getUsers(){
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data().email}`);
    });
}

async function checkUserExistence(email){
    try {
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
    
        if (querySnapshot.size === 0) {
          console.log("No matching documents found.");
          return;
        }


        querySnapshot.forEach((doc) => {
          console.log(`Document with email ${doc.data()} .`);
        });
    } catch (error) {
      
    }
}

async function deleteUser(email) {
  try {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size === 0) {
      console.log("No matching documents found.");
      return;
    }

    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
      console.log(`Document with email ${email} deleted successfully.`);
    });
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
}




