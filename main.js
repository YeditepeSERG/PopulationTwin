const map = createMap();
let buildingsGeoJSON = null;
window.onload = init;

function init(){
  buildingsGeoJSON = loadGeoJSON(pathOfMap);
  map.addLayer(buildingsGeoJSON);
  drawShapesOnMap(buildingsGeoJSON);
  
  getIDOfLastBuilding()
  .then(id => {
    lastID = id;
  })

}

function createMap(){
    let view = new ol.View({
      center: [3245075.5956414873, 5008280.403576283],
      zoom: 1,
      maxZoom: 20,
    })

    const map = new ol.Map({
        view : view,
        target: 'js-map'
    });

    const standartLayer = new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible: true,
        zIndex: 1,
        title: "OSMStandard"
    });

    
    const humaniterianLayer = new ol.layer.Tile({
        source: new ol.source.OSM({
          url: ' https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        }),
        visible: false,
        zIndex: 1,
        title: "OSMHumanitarian"
    });

    const key = '0GaezYjFLpwM2dMexGjy';
    const roadLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
          url: 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=' + key,
        }),
        visible: false,
        zIndex: 1,
        title: "XYZRoad",
    });

    const aerialLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
          url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
        }),
        visible: false,
        zIndex: 1,
        title: "XYZAeriel",
    });

    const baseLayerGroup = new ol.layer.Group({
      layers: [ standartLayer, humaniterianLayer, roadLayer, aerialLayer]
    });

    const baseLayerElements = document.getElementById('maps');
    baseLayerElements.addEventListener('change', function() {
      var baseLayerElementValue = baseLayerElements.options[baseLayerElements.selectedIndex].value;
      baseLayerGroup.getLayers().forEach(function(element,index,array){
        let baseLayerTitle = element.get('title');
        element.setVisible(baseLayerTitle === baseLayerElementValue);
      });
    });

    map.addLayer(baseLayerGroup);
    return map;
}

function loadGeoJSON(path){
    const buildingsGeoJSON = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: path,
            format: new ol.format.GeoJSON()
        }),
        opacity: 0.8,
        visible: true,
        zIndex: 1,
        title: 'buildingsGeoJSON',
    });
    return buildingsGeoJSON;
}

function getInfosOfAreas(name){
  for(var i=0 ; i<areas.length ; i++){
    var area = areas[i];
    if(area.name.match(name)){
      return area;
    }
  }
  return null;
}

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

function generatePropertiesFormByConfig(path, formId){
  return new Promise ((resolve, reject) => {
    fetch(path)
    .then(response => response.json())
    .then(data => {
        let formElement = document.getElementById(formId);

        data.fields.forEach(fieldConfig => {
            let formDiv = document.createElement('div');
            formDiv.classList.add('form-outline', 'bg-dark', 'mb-4', 'p-3');

            let labelElement = document.createElement('label');
            labelElement.classList.add('form-label', 'text-white');
            labelElement.innerText = fieldConfig.label;

            let fieldElement = document.createElement(fieldConfig.type);
            fieldElement.id = fieldConfig.id;

            fieldConfig.class.forEach(element => {
              fieldElement.classList.add(element);
            })

            if (fieldConfig.type === 'select') {
                fieldConfig.options.forEach(option => {
                    let optionElement = document.createElement('option');
                    optionElement.value = option.value;
                    optionElement.text = option.text;
                    fieldElement.appendChild(optionElement);
                });
            }
            else{
              let input = document.createElement('input');
              input.type =fieldConfig.typeOfInput;
              input.id = fieldConfig.id;
              fieldElement.appendChild(input);
            }

            formDiv.appendChild(labelElement);
            formDiv.appendChild(fieldElement);
            formElement.appendChild(formDiv);
        });

        let buttonDiv = document.createElement('div');
        buttonDiv.classList.add('form-outline', 'mb-4', 'p-3');

        data.buttons.forEach(buttonConfig => {

            let buttonElement = document.createElement('button');
            buttonElement.type = buttonConfig.type;
            buttonElement.id = buttonConfig.id;
            
            buttonConfig.class.forEach(element => {
              buttonElement.classList.add(element);
            })
            buttonElement.innerText = buttonConfig.text;

            buttonDiv.appendChild(buttonElement);
        });
          
        formElement.appendChild(buttonDiv);

        resolve(formElement);
    })
    .catch(error => {
      reject(error);
  });
  })
}

function getIDListOfPropertiesForm(path){
  return new Promise ((resolve, reject) => {
    fetch(path)
    .then(response => response.json())
    .then(data => {
      let idList = [];

      data.fields.forEach(fieldConfig => {
          let type;
          if(fieldConfig.type === "select"){
            type = "text";
          }
          else{
            type = fieldConfig.typeOfInput;
          }

          let element = {
            "id": fieldConfig.id,
            "type": type
          }

          idList.push(element);
      });

      resolve(idList); 
    })
    .catch(error => {
      reject(error);
    });
  })
}

function getLabelOfTheFieldsByID(path, id){
  return new Promise ((resolve, reject) => {
    fetch(path)
    .then(response => response.json())
    .then(data => {

      data.fields.forEach(fieldConfig => {
          if(id === fieldConfig.id){
            resolve(fieldConfig.label);
          }
      });
      resolve("");
    })
    .catch(error => {
      reject(error);
    });
  })
}