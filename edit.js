import {getEditAreaListByAccount, getViewAreaListByAccount} from "./userRepository.js";

var selectedFeature = null;
let featureProperties;

let areasElements = document.getElementById('areas');

let editToggleButton = document.getElementById("editToggle"); 
let undoButton = document.getElementById("undoButton");
let saveToJsonButton = document.getElementById("saveToJsonButton");
let editToggleUpdateButton = document.getElementById("editToggle-update"); 
let unsavedChangesText = document.getElementById("unsavedChangesText");
let propertiesSidebar = document.getElementById("propertiesSidebar");
let savePropertiesButton = document.getElementById("savePropertiesButton");
let deleteBuildingButton = document.getElementById("deleteBuildingButton");

editToggleButton.checked = false;
undoButton.style.display = 'none';
saveToJsonButton.style.display = 'none';
editToggleUpdateButton.checked = false;
unsavedChangesText.style.display = 'none';
setUpAccordingToEditor();

areaSelection();
setPopup(map);

const vectorSource = new ol.source.Vector({wrapX: false});
const vectorLayer = new ol.layer.VectorImage({
    source: vectorSource,
    opacity: 0.8,
    visible: true,
    zIndex: 1,
});
map.addLayer(vectorLayer);

let draw = new ol.interaction.Draw({
    source: vectorSource,
    type: 'Polygon',
});

draw.on('drawend', function (event) {
    unsavedChangesText.style.display = 'block';
    selectedFeature = event.feature;    // update the selected feature
    openEditNav();
});

editToggleUpdateButton.onclick = () => {
    if (editToggleUpdateButton.checked && editToggleButton.checked) {
        editToggleButton.click();
    }

    closeEditNav();
};

editToggleButton.onclick = () => {
    if (editToggleButton.checked) {
        if (editToggleUpdateButton.checked) {
            editToggleUpdateButton.click();
        }

        map.addInteraction(draw);
        undoButton.style.display = 'block';
        saveToJsonButton.style.display = 'block';
    } else {
        map.removeInteraction(draw);
        undoButton.style.display = 'none';
        saveToJsonButton.style.display = 'none';
    } 

    closeEditNav();
};

undoButton.onclick = () => {
    draw.removeLastPoint();
};

saveToJsonButton.onclick = () => {
    let infos = [];

    let features = vectorLayer.getSource().getFeatures();
    features.forEach(feature => {
        let coords = getCoordinatesByFeature(feature);
        var newBuilding = getNewBuildingByFeature(feature);
        if (newBuilding) {
            let info = {
                "newBuilding": newBuilding,
                "coordinatesList": coords,
            };
            infos.push(info);
        }
    });

    addNewBuildingToJsonByInfos(infos)
    .then(message => {
        reloadLayer();
    });
    unsavedChangesText.style.display = 'none';
    vectorSource.clear();
};

savePropertiesButton.onclick = () => {
    let buildingType = document.getElementById("building-type").value;
    let buildingName = document.getElementById("building-name").value;
    let buildingPopulation = parseInt(document.getElementById("building-population").value) || "";    

    let rawProperties = {
        "buildingType": buildingType,
        "name": buildingName,
        "population": buildingPopulation,
    };

    try {
        isPropertiesEmpty(rawProperties);
    } catch (error) {
        alert(error.message);
        return;
    }

    selectedFeature.setProperties(rawProperties);
    if(selectedFeature.getProperties().id){
        let id = selectedFeature.getProperties().id;
        let building = getNewBuildingByFeature(selectedFeature);
        lastID--;
        updateToInfOfBuildingByID(id, building);
        selectedFeature.setStyle(getStyleByColor(building.getColor()));
    }

    closeEditNav();
};

deleteBuildingButton.onclick = async () => {
    let id = selectedFeature.getProperties().id;
    if (id) {
        deleteBuildingByID(id)
        .then(message => {
            reloadLayer();
        });
    }
    else{
        vectorLayer.getSource().removeFeature(selectedFeature);
        selectedFeature = null;
    
        if (vectorLayer.getSource().getFeatures().length === 0) {
            unsavedChangesText.style.display = 'none';
        }
    }
    closeEditNav();
}

function openEditNav() {
    propertiesSidebar.style.width = "300px";

    // default values
    let buildingType = document.getElementById("building-type").value;
    let name = "";
    let population = "";

    if (selectedFeature) {
        selectedFeature.setStyle(getStyleForEditing());
        
        featureProperties = selectedFeature.getProperties();
        buildingType = featureProperties.buildingType ?? buildingType;
        name = featureProperties.name ?? name;
        population = featureProperties.population ?? population;
    }

    document.getElementById("building-type").value = buildingType;
    document.getElementById("building-name").value = name;
    document.getElementById("building-population").value = population;

    let focusElement = document.getElementById("building-name");
    focusElement.focus();
    focusElement.setSelectionRange(focusElement.value.length, focusElement.value.length);
}

function closeEditNav() {
    propertiesSidebar.style.width = "0px";

    if (selectedFeature) {
        let properties = selectedFeature.getProperties();
        let color;
        if (properties.population){
            let riskScale = determineRiskScale(properties.population);
            color = getColorByRiskScale(riskScale);
        }
        if(!selectedFeature.getProperties().id){
            color = "white";
        }
        selectedFeature.setStyle(getStyleByColor(color));
    }
}

function getNewBuildingByFeature(feature){
    featureProperties = feature.getProperties();
    let featureBuildingType = featureProperties.buildingType;
    let featureName = featureProperties.name;
    let featurePopulation = featureProperties.population;

    try{
        isPropertiesEmpty(featureProperties);
        const newBuilding = new Building(featureBuildingType, featureName, featurePopulation);
        return newBuilding;
    }
    catch{
        return null;
    }
}

function getCoordinatesByFeature(feature){
    let multiCoords = feature.getGeometry().getCoordinates();
    multiCoords.forEach((coords, i) => {
        coords.pop();
        coords.forEach((element, i) => {
            coords[i] = ol.proj.transform(element, 'EPSG:3857', 'EPSG:4326');
        });
    });
    return multiCoords;
}

function isPropertiesEmpty(properties){
    for (let key in properties) {
        if(properties[key] === ""){
            throw new Error(`${key} field not entered!`);
        }
    }
}

function editConstraint(){
    const email = window.sessionStorage.getItem("email")
    
    getEditAreaListByAccount(email).then(data=>{
        const areasElements = document.getElementById('areas');
        // var areaValue = areasElements.options[areasElements.selectedIndex].value;
        console.log(data)
        areasElements.addEventListener("change", ()=>{
            var areaValue = areasElements.options[areasElements.selectedIndex].value;
            let editPermission = data.includes(areaValue)
            if(!editPermission){
                document.getElementById("editDiv").style.display = "none"
                document.getElementById("drawDiv").style.display = "none"
            }else{
                document.getElementById("editDiv").style.display = "block"
                document.getElementById("drawDiv").style.display = "block"
            }
            
        })
    })
  }

async function setUpAccordingToEditor(){
    const email = window.sessionStorage.getItem("email");
    var listOfAreas = [];

    await getViewAreaListByAccount(email)
    .then(viewList => {
        viewList.forEach(area => {
            listOfAreas.push(area);
        })
    })

    await getEditAreaListByAccount(email)
    .then(editList => {
        editList.forEach(area => {
            listOfAreas.push(area);
        })
    })

    listOfAreas = Array.from(new Set(listOfAreas));
    addOptionToSelectByID('areas', listOfAreas);
    editConstraint();
}

function setPopup(map){
    let container = document.getElementById('popup');
    let content = document.getElementById('popup-content');
    let closer = document.getElementById('popup-closer');
    
    let overlay = new ol.Overlay({
      element: container,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });

    map.addOverlay(overlay)

    map.on('click', (e)=>{
      map.forEachFeatureAtPixel(e.pixel, feature => {
        if (window.location.pathname === "/admin.html" && document.getElementById("editToggle").checked){
          return;
        } 

        if (window.location.pathname === "/admin.html" && document.getElementById("editToggle-update").checked){
            closeEditNav();
            selectedFeature = feature; // update the selected feature
            openEditNav();
            overlay.setPosition(undefined);
            closer.blur();
            return;
        } 

        let infoTxt = `<p>`
        for (var key in feature.values_){
          if(listOfNotTranferred.includes(key) || key == "geometry"){
            continue;
          }
          infoTxt = infoTxt + `${key}: ${feature.values_[key]}<br>`;
        }
        infoTxt = infoTxt + `</p><code>`;

        content.innerHTML = infoTxt;
        overlay.setPosition(e.coordinate);
      });
    });

    closer.onclick = function () {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };
}

function areaSelection(){

    areasElements.addEventListener('click', function() {
        let areaValue = areasElements.options[areasElements.selectedIndex].value;
        let info = getInfosOfAreas(areaValue);
        pathOfMap = info.path;
        map.setView(info.view);
        changeLayerByPath();
    });
} 

function changeLayerByPath(){
if (window.location.pathname === "/admin.html"){
    editToggleButton.checked = false;
    map.removeInteraction(draw);
    reloadLayer();

    getIDOfLastBuilding()
    .then(id => {
        lastID = id;
    });
    }
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
  
function reloadLayer(){
    map.removeLayer(buildingsGeoJSON);
    buildingsGeoJSON = loadGeoJSON(pathOfMap);
    map.addLayer(buildingsGeoJSON);
    drawShapesOnMap(buildingsGeoJSON);
}