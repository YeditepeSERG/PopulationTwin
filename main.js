window.onload = init;
function init(){
    const map = new ol.Map({
        view : new ol.View({
            center: [3245075.5956414873, 5008280.403576283],
            zoom: 17,
            maxZoom: 20
        }),
        target: 'js-map'
    });

    const standartLayer = new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible: true,
        zIndex: 1,
        title: "StandartLayer"
    });

    map.addLayer(standartLayer);

    map.on('click',function(e){
        console.log(e.coordinate)
    });

    let buildingsGeoJSON = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: './data/map.geojson',
            format: new ol.format.GeoJSON()
        }),
        opacity: 0.8,
        visible: true,
        zIndex: 1,
        title: 'buildingsGeoJSON',
    });

    var features = buildingsGeoJSON.getSource().getFeatures();
    console.log(buildingsGeoJSON);
    changeStyleByPopulation(features);
    map.addLayer(buildingsGeoJSON)
    //buildingsGeoJSON.setStyle(getStyleByPopulation(100));

    //drawShapesOnMap("./data/map.geojson", map);

    var layers = map.getLayers();
        layers.forEach(function(layer) {
        console.log("main: ",layer.get('title'));
    });
}