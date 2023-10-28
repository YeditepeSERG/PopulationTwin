class Building{
    constructor(properties){
        getIDListOfPropertiesForm("./properties.json")
        .then((idList) => {
            idList.forEach(element => {
                let id = element.id;
            })
        })
        this.id = lastID+1;
        lastID++;

        this.buildingType = properties.buildingType;
        this.buildingName = properties.buildingName;
        this.buildingPopulation = properties.buildingPopulation;
        this.isThereFireEscape = properties.isThereFireEscape;
        this.isThereShop = properties.isThereShop;
        this.isThereElevator = properties.isThereElevator;
        this.isThereBuildingRiskAnalyse = properties.isThereBuildingRiskAnalyse;
        this.constructionDate = properties.constructionDate;
        this.numberOfFloor = properties.numberOfFloor;
        this.personsM2 = properties.personsM2;
        this.roadWidth = properties.roadWidth;
        this.roadType = properties.roadType;
        this.basement = properties.basement;
        this.percentageOfHumidity = properties.percentageOfHumidity;


        this.coordinate = null;
        // this.risk = determineRiskScale(this.buildingPopulation);
        //this.color = getColorByRiskScale(this.risk);
        this.imgPath = getImageByType(this.buildingType);

        this.vul_buildingType = getBuildingVul(this.buildingType)
        this.vul_escapeStairs = fireEscapeVul(this.isThereFireEscape)
        this.vul_buildingDate = getConsturctionDateVul(this.constructionDate)
        this.vul_shopUnderBuilding = shopVul(this.isThereShop)
        this.vul_elevator = elevatorVul(this.isThereElevator)
        this.vul_riskAnalyse = riskAnalyzeVul(this.isThereBuildingRiskAnalyse)
        this.vul_numOfFloors = numberOfFloorVul(this.numberOfFloor) 
        this.vul_basement  = getBasementVul(this.basement) 
        this.vul_humidity = getHumidityVul(this.percentageOfHumidity)

        this.risk = determineRiskScale(this.vul_buildingType, this.vul_escapeStairs, this.vul_buildingDate, this.vul_shopUnderBuilding, this.vul_elevator, this.vul_riskAnalyse, this.vul_numOfFloors, this.vul_basement, this.vul_humidity);
        this.color = getColorByRiskScale(this.risk);
        this.imgPath = getImageByType(this.buildingType);

    }

    async setIDByLastBuilding(){
        this.setID(await getIDOfLastBuilding() + 1);
    }

    setID(id){
        this.id = id;
    }

    getID(){
        return this.id;
    }

    setCoordinate(coordinate){
        this.coordinate = coordinate;
    }

    getCoordinate(){
        return this.coordinate;
    }
 
    setRisk(risk){
        risk = this.risk;
    }

    getRisk(){
        return this.risk;
    }
    
    setColor(color){
        color = this.color;
    }

    getColor(){
        return this.color;
    }

    setImgPath(imgPath){
        imgPath = this.imgPath;
    }

    getImgPath(){
        return this.imgPath;
    }
}

function getBuildingVul(buildingType){
    switch(buildingType){
        case "Apartment":
            return 10;
        case "School":
            return 5;
        case "Hospital":
            return 8;
        case "Business Center":
            return 2;
        case "Shopping Mall":
            return 4;
    }
} 

function getConsturctionDateVul(constructionDate){
    switch(constructionDate){
        case "1960-1970":
            return 10;
        case "1971-1980":
            return 10;
        case "1981-1990":
            return 10;
        case "1991-2000":
            return 7;
        case "2011-2020":
            return 4;
        case "2020-2023":
            return 2;
    }
}

function getHumidityVul(humidity){
    switch(humidity){
        case "0":
            return 0;
        case "50":
            return 5;
        case "100":
            return 10;
    }
}

function getBasementVul(basement){
    switch(basement){
        case true:
            return 2;
        case false:
            return 10;
    }
}

function riskAnalyzeVul(isThereBuildingRiskAnalyse){
    switch(isThereBuildingRiskAnalyse){
        case true:
            return 2;
        case false:
            return 10;
    }
}

function numberOfFloorVul(numberOfFloor){
    switch(numberOfFloor){
        case "0-3":
            return 1;
        case "3-6":
            return 4;
        case "6-19":
            return 10;
        case "20-inf":
            return 2;

    }
}

function fireEscapeVul(isThereFireEscape){
    console.log(isThereFireEscape)
    switch(isThereFireEscape){
        case true:
            return 0;
        case false:
            return 10;
    }
}

function elevatorVul(isThereElevator){
    switch(isThereElevator){
        case true:
            return 2;
        case false:
            return 10;
    }
}

function shopVul(isThereShop){
    switch(isThereShop){
        case true:
            return 10;
        case false:
            return 0;
    }
}
function determineRiskScale(vul_buildingType, vul_buildingDate, vul_escapeStairs, vul_shopUnderBuilding, vul_elevator, vul_riskAnalyse, vul_numOfFloors, vul_basement, vul_humidity){
    var x, vul_x, vul_z, buildingRisk;


    x = (vul_basement + vul_humidity) / 2


    if(x > 7.5){
        vul_x = 10;
    }else if(3 < x <= 7.5){
        vul_x = 5;
    }else if(x <= 3){
        vul_x = 2;
    }

    console.log("vul_buildingDate: " + vul_buildingDate )
    console.log("vul_riskAnalyse: " + vul_riskAnalyse )
    console.log("vul_numOfFloors: " + vul_numOfFloors )
    console.log("vul_escapeStairs: " + vul_escapeStairs )
    console.log("vul_elevator: " + vul_elevator )
    console.log("vul_shopUnderBuilding: " + vul_shopUnderBuilding )
    console.log("vul_buildingType: " + vul_buildingType )
    console.log("vul_basement: " + vul_basement )
    console.log("vul_humidity: " + vul_humidity )

    



    vul_z = [(vul_buildingDate + vul_riskAnalyse + vul_numOfFloors + vul_escapeStairs + vul_elevator + vul_shopUnderBuilding) / 6] * (vul_buildingType/10)

    if(vul_basement === 10){
        return (vul_z / 2);
    }else{
        let buildingRisk = (vul_x + vul_z) / 2;
        console.log(buildingRisk)
        return buildingRisk;
    }
    
}


// function determineRiskScale(population){
//     for(var i=0; i<=populationRanges.length; i++){
//         if(population >= populationRanges[i].MinPop){
//             return populationRanges[i].Risk;
//         }
//     }
//     return null;
// }



function getColorByRiskScale(risk) {
    listOfColorByRisk.sort((a, b) => b.Risk - a.Risk);

    for (var i = 0; i < listOfColorByRisk.length; i++) {
        if (risk >= listOfColorByRisk[i].Risk) {
            console.log(listOfColorByRisk[i].Color)
            return listOfColorByRisk[i].Color;
        }
    }
    console.log("null")
    return null;
}


function getImageByType(buildingType){
    for(var i=0; i<=buildingList.length; i++){
        if(buildingType == buildingList[i].Type){
            return buildingList[i].ImgPath;
        }
    }
    return null;
}

function getStyleByColor(fillColor){
    var strokeColor = "black";
    var strokeWidth = 1.2;

    const style = new ol.style.Style({
        fill: new ol.style.Fill({
            color: fillColor,
        }),
        stroke: new ol.style.Stroke({
            color: strokeColor,
            width: strokeWidth
        }),
    });
    return style;
}

function getStyleForEditing(){
    var fillColor = "white";
    var strokeColor = "red";
    var strokeWidth = 3;

    const style = new ol.style.Style({
        fill: new ol.style.Fill({
            color: fillColor,
        }),
        stroke: new ol.style.Stroke({
            color: strokeColor,
            width: strokeWidth
        }),
    });
    return style;
}

function drawShapesOnMap(layer){
    let delayTime = 100;
    setTimeout(() => {
        features = layer.getSource().getFeatures();
        features.forEach((feature) => {
            const style = getStyleByColor(feature.values_.color)
            feature.setStyle(style)
        });  
    }, delayTime); 
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