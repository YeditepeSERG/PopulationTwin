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


        this.coordinate = null;
        this.risk = determineRiskScale(this.buildingPopulation);
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

function determineRiskScale(population){
    for(var i=0; i<=populationRanges.length; i++){
        if(population >= populationRanges[i].MinPop){
            return populationRanges[i].Risk;
        }
    }
    return null;
}

function getColorByRiskScale(risk){
    for(var i=0; i<=listOfColorByRisk.length; i++){
        if(risk == listOfColorByRisk[i].Risk){
            return listOfColorByRisk[i].Color;
        }
    }
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