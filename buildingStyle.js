import {Style, Fill, Stroke} from "ol/style.js"
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
let features;
export function getColorByPopulation(population){
    for(var i=0; i<populationRanges.length; i++){
        if(population >= populationRanges[i].MinPop){
            return populationRanges[i].Color;
        }
    }
    return null;
}

export function getStyleByPopulation(population){
    var fillColor = getColorByPopulation(population);
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

export function drawShapesOnMap(layer){
    let delayTime = 100;
    setTimeout(() => {
        features = layer.getSource().getFeatures();
        features.forEach((feature) => {
            const style = getStyleByPopulation(feature.getProperties().Population)
            feature.setStyle(style)
        });  
    }, delayTime); 
}

export function drawShapesOnMapForBuilding(layer){
    let delayTime = 100;
    setTimeout(() => {
        features = layer.getSource().getFeatures();
        features.forEach((feature) => {
            const style = feature.getProperties().getStyle();
            feature.setStyle(style)
        });  
    }, delayTime); 
}