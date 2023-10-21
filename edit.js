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

    let saveProperties = document.getElementById("saveProperties");
    saveProperties.onclick = () => {
        var buildingType = document.getElementById("building-type").value;
        var buildingName = document.getElementById("building-name").value;
        var buildingPopulation = parseInt(document.getElementById("building-population").value) || "";    

        let feature = event.feature;
        let rawProperties = {
            "buildingType": buildingType,
            "name": buildingName,
            "population": buildingPopulation,
        };

        try {
            isPropertiesEmpty(rawProperties);
            feature.setProperties(rawProperties);
            feature.setStyle(getStyleByColor("white"));
        } catch (error) {
            alert(error.message);
        }
    }
});

let editToggleButton = document.getElementById("editToggle"); 
editToggleButton.checked = false;
editToggleButton.onclick = () => {
    (editToggleButton.checked) ? map.addInteraction(draw) : map.removeInteraction(draw);
};

let undoButton = document.getElementById("undoButton");
undoButton.onclick = () => {
    if (!editToggleButton.checked) {
        alert("You need to toggle edit mode in order to use this function.")
        return;   
    }

    draw.removeLastPoint();
};

let saveButton = document.getElementById("saveButton");
saveButton.onclick = () => {
    if (!editToggleButton.checked) {
        alert("You need to toggle edit mode in order to use this function.")
        return;   
    }

    let features = vectorLayer.getSource().getFeatures();
    features.forEach(feature => {
        featureProperties = feature.getProperties();
        featureBuildingType = featureProperties.buildingType;
        featureName = featureProperties.name;
        featurePopulation = featureProperties.population;

        let coords = feature.getGeometry().flatCoordinates;
        let xy_coords = splitArrayIntoPairs(coords, 2);
        xy_coords.pop();
        xy_coords.forEach((element, i) => {
            xy_coords[i] = ol.proj.transform(element, 'EPSG:3857', 'EPSG:4326');
        });

        let newBuilding = new Building(featureBuildingType, featureName, featurePopulation);
        addNewBuildingToJson(newBuilding, [xy_coords]);

    });

    vectorSource.clear();
    setTimeout(init, 100);
};

// helper function
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