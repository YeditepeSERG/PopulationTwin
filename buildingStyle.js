let populationRanges = [
    {
        "Density": "EXTREMEHIGH",
        "Color": "red",
        "MinPop": 2000
    },
    {
        "Density": "HIGH",
        "Color": "orange",
        "MinPop": 1200
    },
    {
        "Density": "MID",
        "Color": "yellow",
        "MinPop": 800
    },
    {
        "Density": "LOW",
        "Color": "green",
        "MinPop": 400
    },
    {
        "Density": "EXTREMELOW",
        "Color": "grey",
        "MinPop": 0
    }
]

function getColorByPopulation(population){
    for(var i=0; i<populationRanges.length; i++){
        if(population >= populationRanges[i].MinPop){
            return populationRanges[i].Color;
        }
    }
    return null;
}

function getStyleByPopulation(population){
    var fillColor = getColorByPopulation(population);
    var strokeColor = "black";
    var strokeWidth = 1.2;
    var text = population.toString();
    var textFont = "bold 10px serif";

    const style = new ol.style.Style({
        fill: new ol.style.Fill({
            color: fillColor,
        }),
        stroke: new ol.style.Stroke({
            color: strokeColor,
            width: strokeWidth
        }),
        text: new ol.style.Text({
            text: text,
            font: textFont
        })
    });
    return style;
}

function drawShapesOnMap(layer){
    let delayTime = 20;
    setTimeout(() => {
        features = layer.getSource().getFeatures();
        features.forEach((feature) => {
            const style = getStyleByPopulation(feature.getProperties().Population)
            feature.setStyle(style)
        });  
    }, delayTime); 
}