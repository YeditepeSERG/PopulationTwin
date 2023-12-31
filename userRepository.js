import { addDoc, collection, getFirestore, getDocs, deleteDoc, doc, query, where, updateDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";

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

const db = getFirestore(app);

export function checkUserExistence(email){

  return new Promise( async (resolve,reject) => {

    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size === 0) {
        resolve(false)
      }

      querySnapshot.forEach((doc) => {
        resolve(true);
      });

    }catch (error) {
      reject(error);
    }
  });
}

export function createUser(email, view_list, edit_list){

  return new Promise( async (resolve,reject) => {
    
    await checkUserExistence(email)
    .then((check)=>{
      if( check ){
        resolve("User already exist in the database");
      }
      else{
        try {
          const docRef = addDoc(collection(db, "users"), {
            email: email,
            view_list: view_list,
            edit_list: edit_list,
          });
    
          resolve(`${email} is added.`);
        } catch (e) {
          reject(e);
        }
      }
    })
  });
}

async function getUsers(){
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data().email}`);
    });
}

async function deleteUser(email) {
  return new Promise( async (resolve,reject) => {
    
    await checkUserExistence(email).then((check)=>{
      if( !check ){
        resolve("User is not exist in database");
      }
    });

    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
  
      querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
        resolve(`Document with email ${email} deleted successfully.`);
      });
    } catch (e) {
      reject(e);
    }
  });
}

export function getViewAreaListByAccount(email){
 
  return new Promise( async (resolve,reject)=> {
    await checkUserExistence(email).then((check)=>{
      if( !check ){
        resolve([]);
      }
    })
    .catch(error => reject(error));

    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        resolve(doc.data().view_list);
      });

    } catch (error) {
      reject(error);
    }
  });
}

export function getEditAreaListByAccount(email){

  return new Promise( async (resolve,reject)=> {
    await checkUserExistence(email).then((check)=>{
      if( !check ){
        resolve([]);
      }
    })
    .catch(error => reject(error));

    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        resolve(doc.data().edit_list);
      });

    } catch (error) {
      reject(error);
    }
  });
}

export async function addViewAreaForAccount(email, listOfArea){

  return new Promise( async (resolve,reject)=> {
    await checkUserExistence(email).then((check)=>{
      if( !check ){
        resolve("User is not exist");
      }
    })
    .catch(error => reject(error));

    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);     

      querySnapshot.forEach((doc) => {
        var existinglist = doc.data().view_list;
        listOfArea.forEach(area => {
          if (! existinglist.includes(area)){
            console.log("Area: ", area);
            existinglist.push(area);
          } 
        });

        updateDoc(doc.ref, {
          view_list: existinglist
        });
      });

      resolve(`Added new areas in view list.\nAccount: ${email}`)

    } catch (error) {
      reject(error);
    }
  });
}

async function addEditAreaForAccount(email, listOfArea){

  return new Promise( async (resolve,reject)=> {
    await checkUserExistence(email).then((check)=>{
      if( !check ){
        resolve("User is not exist");
      }
    })
    .catch(error => reject(error));

    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);     

      querySnapshot.forEach((doc) => {
        var existinglist = doc.data().edit_list;
        listOfArea.forEach(area => {
          if (! existinglist.includes(area)){
            existinglist.push(area);
          } 
        });

        updateDoc(doc.ref, {
          edit_list: existinglist
        });
      });

      resolve(`Added new areas in edit list.\nAccount: ${email}`)

    } catch (error) {
      reject(error);
    }
  });
}

function getViewerListByArea(area){

  return new Promise( async (resolve,reject)=> {

    try {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);     

      var listOfAccount = [];

      querySnapshot.forEach((doc) => {
        var viewList = doc.data().view_list;
        viewList.forEach(element => {
          if (element === area) {
            listOfAccount.push(doc.data().email);
          }
        })
      });

      resolve(listOfAccount);

    } catch (error) {
      reject(error);
    }
  });
}