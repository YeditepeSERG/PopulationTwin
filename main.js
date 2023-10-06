window.onload = init;
function init(){
    const map = new ol.Map({
        view : new ol.View({
            center: [3245075.5956414873, 5008280.403576283],
            zoom: 17,
            maxZoom: 20
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        target: 'js-map'
    })

    map.on('click',function(e){
        console.log(e.coordinate)
    })

    //Adding Vector Layers
    const buildingsGeoJSON = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: './data/map.geojson',
            format: new ol.format.GeoJSON()
        }),
        visible: true,
        title: 'buildingsGeoJSON'
    })

    determineColor("data/map.geojson")

    map.addLayer(buildingsGeoJSON);
}