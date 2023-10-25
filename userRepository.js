import { app } from "./login.js";
import { addDoc, collection, getFirestore, getDocs, deleteDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";


const db = getFirestore(app);

async function createUser(email, view_list, edit_list){
  checkUserExistence(email).then((check)=>{
    console.log(check);
    if( check ){
      console.log("user already exist in the database");
      console.log(email);
      return;
    }

    try {
          const docRef = addDoc(collection(db, "users"), {
            email: email,
            view_list: view_list,
            edit_list: edit_list,
          });
        } catch (e) {
          console.error("Error adding document: ", e);
      }
  })
}

async function getUsers(){
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data().email}`);
    });
}

function checkUserExistence(email){
    return new Promise( async (resolve,reject)=> {
      try {
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
    
        if (querySnapshot.size === 0) {
          resolve(false)
          
          console.log("No matching documents found.");
        }

        querySnapshot.forEach((doc) => {
          console.log(`Document with email ${doc.data()} .`);
          resolve(true);
        });

    } catch (error) {
    }
    })
    
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


createUser("emre@gmail.com", [1,2],[1,2])



