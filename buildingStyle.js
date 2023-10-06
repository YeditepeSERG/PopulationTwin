function determineColor(path){
    fetch(path)
    .then(response => response.json())
    .then(data => {
        for(var i=0; i<data.features.length; i++){
            var population = data.features[i].properties.Population;
            console.log("Population: ", population)
        }
    })
    .catch(error => console.error('Error:', error));
}