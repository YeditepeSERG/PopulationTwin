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

function drawShapesOnMap(path, map){
    fetch(path)
    .then(response => response.json())
    .then(data => {
        const format = new ol.format.GeoJSON();
        const features = format.readFeatures(data)
        let style, population;

        let vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            opacity: 0.8,
            visible: true,
            zIndex: 2,
            title: "VectorLayer"
        });

        features.forEach((feature) => {
            population = feature.getProperties().Population;
            style = getStyleByPopulation(population);

            let newFeature = new ol.Feature({
                type: "Feature",
                geometry: {type: "Polygon", coordinates: new ol.geom.Polygon([feature.getGeometry().getCoordinates()])},
                Population: feature.getProperties().Population,
                Name: feature.getProperties().Name,
            });

            newFeature.setStyle(style);
            vectorLayer.getSource().addFeatures([newFeature]);
        });
        map.addLayer(vectorLayer);
    
        let layers = map.getLayers();
            layers.forEach(function(layer, i) {
                console.log("Layer "+ i + ": ",layer.get('title'));
                if (layer.get('title') != "StandartLayer"){
                    console.log("Features:");
                    layer.getSource().getFeatures().forEach((f, i) => {
                        console.log("Index: "+i,"\nFeature: ",f,"\nProperties: ",f.getProperties(),"\nPopulation: ",f.getProperties().Population ,"\nColor: ",f.getStyle().getFill().getColor(), "\nCoordinates: ", f.getGeometry().getCoordinates()) 
                    });  
                }
        });
    })
    .catch(error => console.error('Error:', error));
}

function changeStyleByPopulation(features){
    //var features = layer.getSource().getFeatures();
    console.log(features);
    features.forEach(feature => {
        let population = feature.getProperties().Population;
        let style = getStyleByPopulation(population);
        feature.setStyle(style)
    })
}