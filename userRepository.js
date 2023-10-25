import { app } from "./login.js";
import { addDoc, collection, getFirestore, getDocs, deleteDoc, doc, query, where, updateDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const db = getFirestore(app);

function checkUserExistence(email){

  return new Promise( async (resolve,reject) => {

    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size === 0) {
        console.log("No matching documents found.");
        resolve(false)
      }

      querySnapshot.forEach((doc) => {
        console.log(`Document with email ${doc.data().email}`);
        resolve(true);
      });

    }catch (error) {
      reject(error);
    }
  });
}

function createUser(email, view_list, edit_list){

  return new Promise( async (resolve,reject) => {
    
    await checkUserExistence(email)
    .then((check)=>{
      if( check ){
        console.log(`check: ${check}`);
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
      if( check ){
        resolve("User already exist in the database");
      }
    });

    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.size === 0) {
        resolve("No matching documents found.");
      }
  
      querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
        resolve(`Document with email ${email} deleted successfully.`);
      });

    } catch (e) {
      reject(e);
    }
  });
}

async function getViewAreaListByAccount(email){
 
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
        console.log("mail: ", email);
        console.log("view_list: ", doc.data().view_list);
        resolve(doc.data().view_list);
      });

    } catch (error) {
      reject(error);
    }
  });
}

async function getEditAreaListByAccount(email){

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
        console.log("mail: ", email);
        console.log("view_list: ", doc.data().edit_list);
        resolve(doc.data().edit_list);
      });

    } catch (error) {
      reject(error);
    }
  });
}

async function addViewAreaForAccount(email, listOfArea){

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

function setSlideBarByAreaList(listOfArea){

}


