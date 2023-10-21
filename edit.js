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
    if (!confirm("Do you want to add this building?")) {
        setTimeout(() => {
            vectorSource.removeFeature(event.feature);
        }, 100);

        //! use existing save button (right side)

        return;
    }

    let feature = event.feature;
    let defaultProperties = {
        "buildingType": "Apartment",
        "name": `id_${feature.ol_uid}`,
        "population": 0,
        "risk": undefined,
        "color": "white",
        "imgPath": null,
    };

    feature.setProperties(defaultProperties);
    feature.setStyle(getStyleByColor(feature.getProperties().color));
});

let editToggleButton = document.getElementById("editToggle"); 
editToggleButton.checked = false;
editToggleButton.onclick = () => {
    if (editToggleButton.checked) {
        map.addInteraction(draw);
        undoButton.style.display = 'block';
        saveButton.style.display = 'block';
    } else {
        map.removeInteraction(draw);
        undoButton.style.display = 'none';
        saveButton.style.display = 'none';
    } 
};

let undoButton = document.getElementById("undoButton");
undoButton.style.display = 'none';
undoButton.onclick = () => {
    if (!editToggleButton.checked) {
        alert("You need to toggle edit mode in order to use this function.")
        return;   
    }

    draw.removeLastPoint();
};

let saveButton = document.getElementById("saveButton");
saveButton.style.display = 'none';
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

        //! BUG: only adds the last building
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
