// helper function
function splitArrayIntoPairs(arr, chunkSize) {
    return arr.reduce(function (result, item, index) {
        if (index % chunkSize === 0) {
            result.push(arr.slice(index, index + chunkSize));
        }
        return result;
    }, []);
}

let editToggleButton = document.getElementById("editToggle"); 
editToggleButton.checked = false;
editToggleButton.onclick = () => {
    if (!loggedIn) {
        editToggleButton.checked = false;
        alert("You are not logged in!")
    }

    if (editToggleButton.checked) {
        addInteraction();
    } else {
        map.removeInteraction(draw);
    }
}

let draw;
const vectorSource = new ol.source.Vector({wrapX: false});
const vectorLayer = new ol.layer.VectorImage({
    source: vectorSource,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'blue',  //! set this according to the color of each future separately
        }),
        stroke: new ol.style.Stroke({
            color: 'black',
            width: 1.5, 
        }),
    }),
    opacity: 0.8,
    visible: true,
    zIndex: 1,
});
map.addLayer(vectorLayer);

function addInteraction() {
    draw = new ol.interaction.Draw({
      source: vectorSource,
      type: 'Polygon',
    });
    map.addInteraction(draw);

    draw.on('drawend', function (event) {
        let feature = event.feature;
        let coords = feature.getGeometry().flatCoordinates;
        let xy_coords = splitArrayIntoPairs(coords, 2);
        xy_coords.pop();
        xy_coords.forEach((element, i) => {
            xy_coords[i] = ol.proj.transform(element, 'EPSG:3857', 'EPSG:4326');
        });

        if (!confirm("Do you want to add this building?")) {
            return;
        }

        let defaultProporties = {
            "buildingType": "",
            "name": "",
            "population": 0,
            "risk": 0,
            "color": "blue",
            "imgPath": null
        };

        feature.setProperties(defaultProporties);

        /*
        ! add save button
        let newBuilding = new Building("test", "test name", 400);   //! fix this
        addNewBuildingToJson(newBuilding, [xy_coords]);
        setTimeout(init, 100)*/
    });
}


/* 
! implement undo button/function
document.getElementById('undo').addEventListener('click', function () {
  draw.removeLastPoint();
});
*/
