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
        "Type": "Apartment",
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
        this.style = getStyleByColor(this.color);
        this.imgPath = getImageByType(this.buildingType);
    }

    getBuildingType(){
        return this.buildingType;
    }

    getName(){
        return this.name;
    }

    getPopulation(){
        return this.population
    }
 
    getRisk(){
        return this.risk;
    }
    
    getColor(){
        return this.color;
    }
    
    getStyle(){
        return this.style;
    }

    getImgPath(){
        return this.imgPath;
    }

    display(){
        console.log("Type: ", this.buildingType, "\nName: ", this.name, "\nPopulation: ", this.population, "\nRisk: ", this.risk, "\nColor: ", this.color, "\nImgPath: ", this.imgPath, "\nStyle: ", this.style);
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

function drawShapesOnMap(layer){
    let delayTime = 100;
    setTimeout(() => {
        features = layer.getSource().getFeatures();
        features.forEach((feature) => {
            const risk = determineRiskScale(feature.getProperties().Population);
            const color = getColorByRiskScale(risk);
            const style = getStyleByColor(color);
            feature.setStyle(style)
        });  
    }, delayTime); 
}

function drawShapesOnMapForBuilding(layer){
    let delayTime = 100;
    setTimeout(() => {
        features = layer.getSource().getFeatures();
        features.forEach((feature) => {
            const style = feature.getProperties().getStyle();
            feature.setStyle(style)
        });  
    }, delayTime); 
}