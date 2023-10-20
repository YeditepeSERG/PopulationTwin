const listOfNotTranferred = ["id", "color", "imgPath"];

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

        const centerOfBuilding = getCenterOfBuilding(coordinatesList[0]);
        const center_HDMS = ol.coordinate.toStringHDMS(centerOfBuilding);
        newBuilding.setCenter(center_HDMS);

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
    
                for (let key in properties) {
    
                    if(listOfNotTranferred.includes(key)){
                        continue;
                    }
    
                    cleanedDataForBuilding[key] = properties[key];
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

function getIDOfLastBuilding(){
    return new Promise((resolve, reject) => {
        fetch(pathOfMap)
        .then(response => response.json())
        .then(data => {
            if(data.features.length == 0){
                resolve(0);
            }
            let lastFeature = data.features[data.features.length - 1];
            let id = lastFeature.properties.id;
            resolve(id);
        })
        .catch(error => reject(error));
    });
}

function resetAllID(data){
    let listOfFeature = data.features;
    let id = 1;
    listOfFeature.forEach(feature => {
        feature.properties.id = id++;
    });
    return data;
}

function deleteBuildingByID(id){
    fetch(pathOfMap)
    .then(response => response.json())
    .then(data => {
        let listOfFeature = data.features;
        listOfFeature.splice(id-1, 1);
        data = resetAllID(data);
        saveNewDataInJson(data);
    })
    .catch(error => console.error('Error:', error));
}

function updateToInfOfBuildingByID(id, building){
    fetch(pathOfMap)
    .then(response => response.json())
    .then(data => {
        let listOfFeature = data.features;

        building.setID(id);
        building.setCenter(listOfFeature[id-1].properties.center);

        listOfFeature[id-1].properties = building;
        saveNewDataInJson(data); 
    })
    .catch(error => console.error('Error:', error));
}