import { pathOfMap } from "./main.js";
//const fs = require('fs');

function saveNewDataInJson(data){
    console.log(data);
    const jsonData = JSON.stringify(data);

    fs.writeFile(pathOfMap, jsonData, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('Data written to file');
        }
    });
}

export function addNewBuildingToJson(newBuilding, coordinatesList){
    fetch(pathOfMap)
    .then(response => response.json())
    .then(data => {
        let newFeature = {"type": "Feature", "properties": newBuilding, "geometry": {"coordinates": coordinatesList, "type":"Polygon"}};
        data.features.push(newFeature);
        console.log("Data: ", data); 
        saveNewDataInJson(data);
    })
    .catch(error => console.error('Error:', error));
}