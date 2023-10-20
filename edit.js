// helper function
function splitArrayIntoPairs(arr, chunkSize) {
    return arr.reduce(function (result, item, index) {
        if (index % chunkSize === 0) {
            result.push(arr.slice(index, index + chunkSize));
        }
        return result;
    }, []);
}

let editToggleButton = document.getElementById("flexSwitchCheckChecked"); 
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
const source = new ol.source.Vector({wrapX: false});

function addInteraction() {
    draw = new ol.interaction.Draw({
      source: source,
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

        let newBuilding = new Building("test", "test name", 400);   //! fix this
        addNewBuildingToJson(newBuilding, [xy_coords]);
        setTimeout(init, 100)
    });
}

/* 
! implement undo button/function
document.getElementById('undo').addEventListener('click', function () {
  draw.removeLastPoint();
});
*/
