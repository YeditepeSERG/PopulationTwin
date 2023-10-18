function saveNewDataInJson(data){
    console.log("d:", data);
    fetch('/update-json', 
    {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newData:data, jsonFilePath:pathOfMap })
    })
}

function addNewBuildingToJson(newBuilding, coordinatesList){
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