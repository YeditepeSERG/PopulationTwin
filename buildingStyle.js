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

function drawShapesOnMap(path, map){
    fetch(path)
    .then(response => response.json())
    .then(data => {
        for(var i=0; i<data.features.length; i++){
            var population = data.features[i].properties.Population;
            
            var vectorSource = new ol.source.Vector({
                features: new ol.format.GeoJSON().readFeatures(data.features[i])
            });

            console.log(vectorSource);

            const vectorLayer = new ol.layer.Vector({
                source: vectorSource
            });

            console.log(vectorLayer);

            map.addLayer(vectorLayer);
        }
    })
    .catch(error => console.error('Error:', error));
}