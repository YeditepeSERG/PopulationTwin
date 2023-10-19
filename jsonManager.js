import { pathOfMap } from "./main.js";
const listOfNotTranferred = ["color", "imgPath"];

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

async function downloadJsonFile(){
    //window.location.href = `download-json/?path=${pathOfMap}`
    try {
        const filename = "information_of_buildings.json";
        const updatedData = await getCleanedJsonData(pathOfMap);
        downloadJsonData(updatedData, filename)
      } catch (error) {
        console.error('Hata:', error);
      }
}

function downloadJsonData(data, filename){
    var json = JSON.stringify(data, null, 2);
    var blob = new Blob([json], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function getCenterOfBuilding(listOfCoordinates){
    let n = listOfCoordinates.length - 1;
    listOfCoordinates = listOfCoordinates.slice(0, n);
    let x_sum = 0;
    let y_sum = 0;

    listOfCoordinates.forEach(coordinate => {
        x_sum += coordinate[0];
        y_sum += coordinate[1];
    });

    let center = [x_sum/n, y_sum/n];
    return center;
}

function getCleanedJsonData(path){
    return new Promise((resolve, reject) => {
        fetch(path)
        .then(response => response.json())
        .then(data => {
    
            let listOfFeature = data.features;
            let updatedData = {"ListOfBuilding": []};
            listOfFeature.forEach(feature => {
    
                const properties = feature.properties;
                const listOfCoordinates = feature.geometry.coordinates[0];
                let cleanedDataForBuilding = {};
    
                let centerOfBuilding = getCenterOfBuilding(listOfCoordinates)
                let center_HDMS = ol.coordinate.toStringHDMS(centerOfBuilding);
    
                for (let key in properties) {
    
                    if(listOfNotTranferred.includes(key)){
                        continue;
                    }
    
                    cleanedDataForBuilding[key] = properties[key];
                    cleanedDataForBuilding["centerCoordinate"] = center_HDMS;
                }
    
                updatedData.ListOfBuilding.push(cleanedDataForBuilding);
            });
            
            resolve(updatedData);
        })
        .catch(error => reject(error));
    });
}