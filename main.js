const map = createMap();
let buildingsGeoJSON = null;
window.onload = init;

function init(){
  buildingsGeoJSON = loadGeoJSON(pathOfMap);
  map.addLayer(buildingsGeoJSON);
  drawShapesOnMap(buildingsGeoJSON);
  
  getIDOfLastBuilding()
  .then(id => {
    lastID = id;
  })

  areaSelection();
  setPopup(map);
}

function createMap(){
    let name = pathOfMap.match(/\/([^\/]+)\.geojson$/)[1];
    let view = getInfosOfAreas(name).view;
    const map = new ol.Map({
        view : view,
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

    const baseLayerElements = document.getElementById('maps');
    baseLayerElements.addEventListener('change', function() {
      var baseLayerElementValue = baseLayerElements.options[baseLayerElements.selectedIndex].value;
      baseLayerGroup.getLayers().forEach(function(element,index,array){
        let baseLayerTitle = element.get('title');
        element.setVisible(baseLayerTitle === baseLayerElementValue);
      });
    });

    map.on('click',function(e){
      console.log(e.coordinate)
    });

    map.addLayer(baseLayerGroup);

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
      map.forEachFeatureAtPixel(e.pixel, feature => {
        if (window.location.pathname === "/admin.html" && document.getElementById("editToggle").checked){
          return;
        } 

        if (window.location.pathname === "/admin.html" && document.getElementById("editToggle-update").checked){
            closeEditNav();
            selectedFeature = feature; // update the selected feature
            openEditNav();
            overlay.setPosition(undefined);
            closer.blur();
            return;
        } 

        let infoTxt = `<p>`
        for (var key in feature.values_){
          if(listOfNotTranferred.includes(key) || key == "geometry"){
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

function areaSelection(){
  const areasElements = document.getElementById('areas');
  areasElements.addEventListener('change', function() {
      var areaValue = areasElements.options[areasElements.selectedIndex].value;
      info = getInfosOfAreas(areaValue);
      pathOfMap = info.path;
      map.setView(info.view);
      changeLayerByPath();
  });
}

function changeLayerByPath(){
  reloadLayer();

  getIDOfLastBuilding()
  .then(id => {
    lastID = id;
  });
}

function getInfosOfAreas(name){
  for(var i=0 ; i<areas.length ; i++){
    var area = areas[i];
    if(area.name.match(name)){
      return area;
    }
  }
  return null;
}

function reloadLayer(){
  map.removeLayer(buildingsGeoJSON);
  console.log('1: ',buildingsGeoJSON.getSource().getFeatures());
  buildingsGeoJSON = loadGeoJSON(pathOfMap);
  console.log('2: ',buildingsGeoJSON.getSource().getFeatures());
  map.addLayer(buildingsGeoJSON);
  drawShapesOnMap(buildingsGeoJSON);
}
