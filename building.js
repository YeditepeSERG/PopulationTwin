let populationRanges = [
    {
        "Risk": 4,
        "Density": "EXTREMEHIGH",
        "MinPop": 2000
    },
    {
        "Risk": 3,
        "Density": "HIGH",
        "MinPop": 1200
    },
    {
        "Risk": 2,
        "Density": "MID",
        "MinPop": 800
    },
    {
        "Risk": 1,
        "Density": "LOW",
        "MinPop": 400
    },
    {
        "Risk": 0,
        "Density": "EXTREMELOW",
        "MinPop": 0
    }
]

let listOfColorByRisk = [
    {
        "Risk": 4,
        "Color": "red"
    },
    {
        "Risk": 3,
        "Color": "orange"
    },
    {
        "Risk": 2,
        "Color": "yellow"
    },
    {
        "Risk": 1,
        "Color": "green"
    },
    {
        "Risk": 0,
        "Color": "grey"
    }
]

let buildingList = [
    {
        "Type": "Apartment",
        "ImgPath": null
    },
    {
        "Type": "test",
        "ImgPath": null
    }    
]

class Building{
    constructor(buildingType, name, population){
        this.buildingType = buildingType;
        this.name = name;
        this.population = population;
        this.risk = determineRiskScale(this.population);
        this.color = getColorByRiskScale(this.risk);
        this.imgPath = getImageByType(this.buildingType);
    }

    setBuildingType(buildingType){
        this.buildingType = buildingType;
    }

    getBuildingType(){
        return this.buildingType;
    }

    setName(name){
        this.name = name;
    }

    getName(){
        return this.name;
    }

    setPopulation(population){
        population = this.population
    }

    getPopulation(){
        return this.population
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

    display(){
        console.log("Type: ", this.getBuildingType, "\nName: ", this.getName, "\nPopulation: ", this.getPopulation, "\nRisk: ", this.getRisk, "\nColor: ", this.getColor, "\nImgPath: ", this.getImgPath);
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

function updateToInfOfBuilding(building, buildingType, name, population){
    building.setBuildingType(buildingType);
    building.setName(name);
    building.setPopulation(population);
    building.setRisk(determineRiskScale(building.getPopulation));
    building.setColor(getColorByRiskScale(building.getRisk));
    building.setImgPath(getImageByType(building.getBuildingType));
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