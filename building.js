import {Fill, Stroke, Style} from 'ol/style.js';



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

    const style = new Style({
        fill: new Fill({
            color: fillColor,
        }),
        stroke: new Stroke({
            color: strokeColor,
            width: strokeWidth
        }),
    });
    return style;
}
