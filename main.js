window.onload = init;

const pathOfMap = './data/map2.geojson';

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

    const buildingsGeoJSON = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: pathOfMap,
            format: new ol.format.GeoJSON()
        }),
        opacity: 0.8,
        visible: true,
        zIndex: 1,
        title: 'buildingsGeoJSON',
    });

    map.addLayer(buildingsGeoJSON);

    drawShapesOnMap(pathOfMap, map);

    //Selected area test start .
    const selectedStyle = new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.6)',
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(255, 255, 255, 0.7)',
          width: 2,
        }),
      });
    const select = new ol.interaction.Select({
        style: function (feature) {
            console.log('the selected feature is : ' + feature.getProperties().Name )
          const color = feature.get('COLOR_BIO') || '#eeeeee';
          selectedStyle.getFill().setColor(color);
          return selectedStyle;
        },
      });
      map.addInteraction(select);
    //Selected area test end.

    var layers = map.getLayers();
        layers.forEach(function(layer) {
        console.log("main: ",layer.get('title'));
    });
}