import userRepository from './userRepository.js'

var selectedFeature = null;

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
        
        let featureProperties = selectedFeature.getProperties();
        buildingType = featureProperties.buildingType ?? buildingType;
        name = featureProperties.name ?? name;
        population = featureProperties.population ?? population;
    }

    document.getElementById("building-type").value = buildingType;
    document.getElementById("building-name").value = name;
    document.getElementById("building-population").value = population;

    focusElement = document.getElementById("building-name");
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
    featureBuildingType = featureProperties.buildingType;
    featureName = featureProperties.name;
    featurePopulation = featureProperties.population;

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

function setUpAccordingToEditor(){
    const email = window.sessionStorage.getItem("email");
    console.log(email);
    var listOfAreas = [];

    userRepository.getViewAreaListByAccount(email)
    .then(viewList => {
        listOfAreas.push(viewList)
    })

    userRepository.getEditAreaListByAccount(email)
    .then(editList => {
        listOfAreas.push(editList)
    })
    addOptionToSelectByID('areas', viewList);
}