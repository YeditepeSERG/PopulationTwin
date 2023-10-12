const path = './data/map3.geojson';

function addNewBuildingToJson(newBuilding, coordinatesList){
    fetch(path)
    .then(response => response.json())
    .then(data => {
        let newFeature = {"type": "Feature", "properties": newBuilding, "geometry": {"coordinates": coordinatesList, "type":"Polygon"}};
        data.features.push(newFeature);
        console.log("Data: ", data);        
    })
    .catch(error => console.error('Error:', error));
}