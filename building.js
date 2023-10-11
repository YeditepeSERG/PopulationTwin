let populationRanges = [
    {
        "Risk": 4,
        "Density": "EXTREMEHIGH",
        "Color": "red",
        "MinPop": 2000
    },
    {
        "Risk": 3,
        "Density": "HIGH",
        "Color": "orange",
        "MinPop": 1200
    },
    {
        "Risk": 2,
        "Density": "MID",
        "Color": "yellow",
        "MinPop": 800
    },
    {
        "Risk": 1,
        "Density": "LOW",
        "Color": "green",
        "MinPop": 400
    },
    {
        "Risk": 0,
        "Density": "EXTREMELOW",
        "Color": "grey",
        "MinPop": 0
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
    for(var i=0; i<=populationRanges.length; i++){
        if(risk == populationRanges[i].Risk){
            return populationRanges[i].Color;
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
