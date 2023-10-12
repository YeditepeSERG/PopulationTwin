window.onload = init;

const pathOfMap = './data/map2.geojson';

function init(){
    const map = createMap();
    const buildingsGeoJSON = loadGeoJSON(pathOfMap);
    
    
    const coor = [
      [
        [
          29.153196148621475,
          40.97379119725855
        ],
        [
          29.153141861075994,
          40.973597969634426
        ],
        [
          29.153374521983523,
          40.973556981883945
        ],
        [
          29.153444320255772,
          40.97374142656119
        ],
        [
          29.153196148621475,
          40.97379119725855
        ]
      ]
    ];

    let newBuilding = new Building("Apartment", "A1", 300);
    addNewBuildingToJson(newBuilding, coor);
    newBuilding.display();
    
    map.addLayer(buildingsGeoJSON);
    drawShapesOnMapForBuilding(buildingsGeoJSON);
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
        title: "OSMStandard"
    });

    
    const humaniterianLayer = new ol.layer.Tile({
        source: new ol.source.OSM({
          url: ' https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        }),
        visible: false,
        zIndex: 1,
        title: "OSMHumanitarian"
    });

    const key = '0GaezYjFLpwM2dMexGjy';
    const roadLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
          url: 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=' + key,
        }),
        visible: false,
        zIndex: 1,
        title: "XYZRoad",
    });

    const aerialLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
          url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
        }),
        visible: false,
        zIndex: 1,
        title: "XYZAeriel",
    });

    const baseLayerGroup = new ol.layer.Group({
      layers: [ standartLayer, humaniterianLayer, roadLayer, aerialLayer]
    });

    const baseLayerElements = document.querySelectorAll('.sidebar > select');
    for(let baseLayerElement of baseLayerElements){
      baseLayerElement.addEventListener('change',function(){
        let baseLayerElementValue = this.value;
        baseLayerGroup.getLayers().forEach(function(element,index,array){
          let baseLayerTitle = element.get('title');
          element.setVisible(baseLayerTitle === baseLayerElementValue);
          if(baseLayerTitle == baseLayerElementValue){
            //element.setVisible(true);
            console.log(element.get('title'));
          }
          else{
            //element.setVisible(false);
            console.log(element.get('title'));
          }
        })
      })
    }
    map.on('click',function(e){
        console.log(e.coordinate)
    });

    map.addLayer(baseLayerGroup);

    return map;
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
        console.log(feature.values_);

        infoTxt = `<p>`
        for (var key in feature.values_){
          if(key == "geometry"){
            continue;
          }
          infoTxt = infoTxt + `${key}: ${feature.values_[key]}<br>`;
        }
        infoTxt = infoTxt + `</p><code>`;

        content.innerHTML = infoTxt;
        overlay.setPosition(e.coordinate);
      });
    });

    closer.onclick = function () {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };
}