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
    
        let layers = map.getLayers();
        layers.forEach(function(layer, i) {
            console.log("Layer "+ i + ": ",layer.get('title'));
            if (layer.get('title') != "StandartLayer"){
                console.log("Features:");
                layer.getSource().getFeatures().forEach((f, i) => {
                    const style = getStyleByPopulation(f.getProperties().Population)
                    f.setStyle(style)
                    
                    // console.log("Index: "+i,"\nFeature: ",f,"\nProperties: ",f.getProperties(),"\nPopulation: ",f.getProperties().Population , "\nCoordinates: ", f.getGeometry().getCoordinates()) 
                });  
            }
        });

    })
    .catch(error => console.error('Error:', error));
    popupMaker(path,  map)
}

//Pop-up making test.
// function popupMaker(path, map) {
//     let container = document.createElement("popup")
//     container.innerHTML = "hello"
//     console.log(container)
//     container.style.color = 'blue'
//     container.style.font = "arial"
//     container.style.fontSize = '15'
    
//     const overlay = new ol.Overlay({
//         element: container,
//         autoPan: {
//           animation: {
//             duration: 250,
//           },
//         },
//       });
    
//     overlay.setPosition([3245075.5956414873, 5008280.403576283])
//     map.addOverlay(overlay)
// } 

function changeStyleByPopulation(features){
    console.log(features);    
    features.forEach(feature => {
        let population = feature.getProperties().Population;
        let style = getStyleByPopulation(population);
        feature.setStyle(style)
    })
}