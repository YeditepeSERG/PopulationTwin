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
    console.log("Event: ", event);
    let feature = event.feature;
    setPropertiesToFeature(feature);
    deleteFeature(feature);
});

let editToggleUpdateButton = document.getElementById("editToggle-update"); 
editToggleUpdateButton.checked = false;
editToggleUpdateButton.onclick = () => {
    if (editToggleUpdateButton.checked && editToggleButton.checked) {
        editToggleButton.click();
    }

    closeEditNav();
};

let editToggleButton = document.getElementById("editToggle"); 
editToggleButton.checked = false;
editToggleButton.onclick = () => {
    if (editToggleButton.checked) {
        if (editToggleUpdateButton.checked) {
            editToggleUpdateButton.click();
        }

        map.addInteraction(draw);
        undoButton.style.display = 'block';
        saveButton.style.display = 'block';
    } else {
        map.removeInteraction(draw);
        undoButton.style.display = 'none';
        saveButton.style.display = 'none';
    } 

    closeEditNav();
};

let undoButton = document.getElementById("undoButton");
undoButton.style.display = 'none';
undoButton.onclick = () => {
    draw.removeLastPoint();
};

let saveButton = document.getElementById("saveButton");
saveButton.style.display = 'none';
saveButton.onclick = () => {
    let features = vectorLayer.getSource().getFeatures();
    features.forEach(feature => {
        let coords = feature.getGeometry().flatCoordinates;
        let xy_coords = splitArrayIntoPairs(coords, 2);
        xy_coords.pop();
        xy_coords.forEach((element, i) => {
            xy_coords[i] = ol.proj.transform(element, 'EPSG:3857', 'EPSG:4326');
        });

        var newBuilding = getNewBuildingByFeature(feature)
        addNewBuildingToJson(newBuilding, [xy_coords]);
    });

    vectorSource.clear();
    setTimeout(init, 100);
};

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

function openEditNav(feature) {
    if (feature) {
        feature.setStyle(getStyleForEditing());
    }
    document.getElementById("mySidebar").style.width = "300px";
}

function closeEditNav() {
    const features = vectorLayer.getSource().getFeatures();
    features.forEach(feature => {
        feature.setStyle(getStyleByColor("white"));
    });
    document.getElementById("mySidebar").style.width = "0";
}

function setPropertiesToFeature(feature){
    openEditNav(feature);

    document.getElementById("building-type").value = feature.getProperties().buildingType || "";
    document.getElementById("building-name").value = feature.getProperties().name || "";
    document.getElementById("building-population").value = feature.getProperties().population || "";

    let saveProperties = document.getElementById("saveProperties");
    saveProperties.onclick = () => {
        try {
            var buildingType = document.getElementById("building-type").value;
            var buildingName = document.getElementById("building-name").value;
            var buildingPopulation = parseInt(document.getElementById("building-population").value) || "";    

            let rawProperties = {
                "buildingType": buildingType,
                "name": buildingName,
                "population": buildingPopulation,
            };

            isPropertiesEmpty(rawProperties);
            feature.setProperties(rawProperties);
            if(feature.values_.id){
                var id = feature.values_.id;
                var building = getNewBuildingByFeature(feature);
                updateToInfOfBuildingByID(id, building);
                feature.setStyle(getStyleByColor(building.getColor()));
            }
            closeEditNav();
        } catch (error) {
            alert(error.message);
        }
    }
}

function deleteFeature(feature){
    let deleteProperties = document.getElementById("delete");
    deleteProperties.onclick = () => {
        if(feature.values_.id){
            var id = feature.values_.id;
            deleteBuildingByID(id);
        }
        else{
            vectorLayer.getSource().removeFeature(feature);
        }
        closeEditNav();
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