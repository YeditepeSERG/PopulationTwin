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
    let delayTime = 100;
    setTimeout(() => {
        features = layer.getSource().getFeatures();
        features.forEach((feature) => {
            const style = getStyleByPopulation(feature.getProperties().Population)
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