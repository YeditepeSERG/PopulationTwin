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
        let xy_coords = getCoordinatesByFeature(feature);
        var newBuilding = getNewBuildingByFeature(feature);
        let info = {
            "newBuilding": newBuilding,
            "coordinatesList": [xy_coords],
        };

        infos.push(info);
    });

    addNewBuildingToJsonByInfos(infos);
    unsavedChangesText.style.display = 'none';
    vectorSource.clear();
    setTimeout(init, 100);
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

deleteBuildingButton.onclick = () => {
    let id = selectedFeature.getProperties().id;
    if (id) {
        deleteBuildingByID(id);
    }

    vectorLayer.getSource().removeFeature(selectedFeature);
    closeEditNav();
    location.reload();
}

function openEditNav() {
    propertiesSidebar.style.width = "300px";

    // default values
    let buildingType = "Apartment";
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
}

function closeEditNav() {
    propertiesSidebar.style.width = "0px";

    if (selectedFeature) {
        let properties = selectedFeature.getProperties();
        let riskScale = determineRiskScale(properties.population);
        let color = getColorByRiskScale(riskScale);
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

    const newBuilding = new Building(featureBuildingType, featureName, featurePopulation);
    return newBuilding;
}

function getCoordinatesByFeature(feature){
    let coords = feature.getGeometry().flatCoordinates;
    let xy_coords = splitArrayIntoPairs(coords, 2);
    xy_coords.pop();
    xy_coords.forEach((element, i) => {
        xy_coords[i] = ol.proj.transform(element, 'EPSG:3857', 'EPSG:4326');
    });
    return xy_coords;
}

function splitArrayIntoPairs(arr, chunkSize) {
    return arr.reduce(function (result, item, index) {
        if (index % chunkSize === 0) {
            result.push(arr.slice(index, index + chunkSize));
        }
        return result;
    }, []);
}

function isPropertiesEmpty(properties){
    for (let key in properties) {
        if(properties[key] === ""){
            throw new Error(`${key} field not entered!`);
        }
    }
}
