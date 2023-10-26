import {getEditAreaListByAccount, checkUserExistence, addViewAreaForAccount} from "./userRepository.js";

const authorizationBtn = document.getElementById("buttonAuthorization");
let passwordPart = document.getElementById("password");
passwordPart.style.display = 'none';

setUpAccordingToEditor();

function addOptionToSelectByID(id, listOfOption){
    var select = document.getElementById(id);
    select.innerHTML = "";
  
    listOfOption.forEach(newOption => {
      var option = document.createElement("option");
      option.value = newOption;
      option.text = newOption;
      select.add(option);
    })
}

async function setUpAccordingToEditor(){
    const email = window.sessionStorage.getItem("email");

    await getEditAreaListByAccount(email)
    .then(editList => {
        addOptionToSelectByID('areas', editList);
    })
}

authorizationBtn.addEventListener('click', async (e) => {
  let email = document.getElementById('form2Example1').value;

  await checkUserExistence(email)
  .then(async (check)=>{
    if( !check ){
      window.location.href=`register.html`
    }
    else{
      const areasElements = document.getElementById('areas');
      var areaValue = areasElements.options[areasElements.selectedIndex].value;
      await addViewAreaForAccount(email, [areaValue]);
    }
  })
})
