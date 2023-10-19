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

function addNewBuildingToJson(newBuilding, coordinatesList){
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

async function downloadFileByType(fileType){
    //window.location.href = `download-json/?path=${pathOfMap}`
    let filename = `information_of_buildings.${fileType}`;
    const cleanedJsonData = await getCleanedJsonData(pathOfMap);

    if(fileType == "json"){
        try{
            downloadJsonData(cleanedJsonData, filename)
        }catch (error) {
            console.error('ERROR:', error);
        }
    }
    else if(fileType == "xml"){
        try{
            xmlData = getXMLDataByJsonData(cleanedJsonData);
            downloadXmlData(xmlData, filename);
        }catch (error) {
            console.error('ERROR:', error);
        }
    }
}

function downloadPart(blob, filename){
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function downloadJsonData(data, filename){
    var json = JSON.stringify(data, null, 2);
    var blob = new Blob([json], { type: "application/json" });
    downloadPart(blob, filename);
}

function downloadXmlData(data, filename){
    var xmlString = new XMLSerializer().serializeToString(data);
    var blob = new Blob([xmlString], { type: "application/xml" });
    downloadPart(blob, filename);
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

function getXMLDataByJsonData(jsonData){
    var serializer = new XMLSerializer();

    var xmlDoc = document.implementation.createDocument(null, 'root', null);
    var list = xmlDoc.createElement('ListOfBuilding');
    xmlDoc.documentElement.appendChild(list);
    
    const listOfBuilding = jsonData.ListOfBuilding;
    
    listOfBuilding.forEach(building => {

        var item = xmlDoc.createElement('Building');

        for (let key in building){

            var newItem = xmlDoc.createElement(key);
            newItem.textContent = building[key];
            item.appendChild(newItem);

        }

        list.appendChild(item);
    });

    var xmlString = serializer.serializeToString(xmlDoc);
    var parser = new DOMParser();
    xmlDoc = parser.parseFromString(xmlString, "application/xml");

    return xmlDoc
}
