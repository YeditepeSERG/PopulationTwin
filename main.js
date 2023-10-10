window.onload = init;

const pathOfMap = './data/map2.geojson';

function init(){
    const map = createMap();
    const buildingsGeoJSON = loadGeoJSON(pathOfMap);
    map.addLayer(buildingsGeoJSON);
    drawShapesOnMap(pathOfMap, map);
    setPopup(map);
}

function createMap(){
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

    return map;
}

function loadGeoJSON(path){
    const buildingsGeoJSON = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: path,
            format: new ol.format.GeoJSON()
        }),
        opacity: 0.8,
        visible: true,
        zIndex: 1,
        title: 'buildingsGeoJSON',
    });
    return buildingsGeoJSON;
}

function setPopup(map){
    let container = document.getElementById('popup');
    let content = document.getElementById('popup-content');
    let closer = document.getElementById('popup-closer');
    
    let overlay = new ol.Overlay({
      element: container,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });

    map.addOverlay(overlay)

    map.on('click', (e)=>{
      map.forEachFeatureAtPixel(e.pixel, feature=>{
          console.log(feature);
          console.log(e.coordinate)
          infoTxt = `<p>${e.coordinate}</p><code>`
          content.innerHTML = infoTxt;
          overlay.setPosition(e.coordinate);
          console.log(content)
      });
    });

    var layers = map.getLayers();
        layers.forEach(function(layer) {
        console.log("main: ",layer.get('title'));
    });
}