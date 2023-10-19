import { pathOfMap } from "./main.js";

function saveNewDataInJson(data){
    fetch('/update-json', 
    {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newData:data, jsonFilePath:pathOfMap })
    })
}

export function addNewBuildingToJson(newBuilding, coordinatesList){
    fetch(pathOfMap)
    .then(response => response.json())
    .then(data => {
        let newFeature = {
            "type": "Feature",
            "properties": newBuilding,
            "geometry": {
                "coordinates": coordinatesList,
                "type":"Polygon"
            }
        };
        data.features.push(newFeature);
        saveNewDataInJson(data); 
    })
    .catch(error => console.error('Error:', error));
}

function downloadJsonFile(){
    window.location.href = `download-json/?path=${pathOfMap}`
}