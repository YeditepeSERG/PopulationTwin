import LayerGroup from "ol/layer/Group";
import OSM from 'ol/source/OSM.js';
import VectorImageLayer from 'ol/layer/VectorImage.js';
import VectorSource from "ol/source/Vector";
import GeoJSON from 'ol/format/GeoJSON.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js'
import TileLayer from "ol/layer/Tile";
import XYZ from 'ol/source/XYZ.js';
import Overlay from 'ol/Overlay.js';

import { drawShapesOnMap } from "./buildingStyle";
import { Building, drawShapesOnMapForBuilding } from "./building";
import { addNewBuildingToJson } from "./jsonManager";

export let pathOfMap = './data/map2.geojson';

window.onload = init;
let version = true;

function init(){
  const map = createMap();
  const buildingsGeoJSON = loadGeoJSON(pathOfMap);
  
  map.addLayer(buildingsGeoJSON);

  if(version){
    drawShapesOnMap(buildingsGeoJSON);
  }
  else{
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
    drawShapesOnMapForBuilding(buildingsGeoJSON)
  }
  setPopup(map);
}

function createMap(){
    const map = new Map({
        view : new View({
            center: [3245075.5956414873, 5008280.403576283],
            zoom: 17,
            maxZoom: 20
        }),
        target: 'js-map'
    });

    const standartLayer = new TileLayer({ // kontrol , Tile idi
        source: new OSM(),
        visible: true,
        zIndex: 1,
        title: "OSMStandard"
    });

    
    const humaniterianLayer = new TileLayer({
        source: new OSM({
          url: ' https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        }),
        visible: false,
        zIndex: 1,
        title: "OSMHumanitarian"
    });

    const key = '0GaezYjFLpwM2dMexGjy';
    const roadLayer = new TileLayer({
        source: new XYZ({
          url: 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=' + key,
        }),
        visible: false,
        zIndex: 1,
        title: "XYZRoad",
    });

    const aerialLayer = new TileLayer({
        source: new XYZ({
          url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
        }),
        visible: false,
        zIndex: 1,
        title: "XYZAeriel",
    });

    const baseLayerGroup = new LayerGroup({ // test et bozulabilir. Degisik isimlendirme oldu node paketinde
      layers: [ standartLayer, humaniterianLayer, roadLayer, aerialLayer]
    });

    const baseLayerElements = document.querySelectorAll('.sidebar > select');
    for(let baseLayerElement of baseLayerElements){
      baseLayerElement.addEventListener('change',function(){
        let baseLayerElementValue = this.value;
        baseLayerGroup.getLayers().forEach(function(element,index,array){
          let baseLayerTitle = element.get('title');
          element.setVisible(baseLayerTitle === baseLayerElementValue);
        })
      })
    }
    map.on('click',function(e){
        console.log(e.coordinate)
    });

    map.addLayer(baseLayerGroup);

    return map;
}

function loadGeoJSON(path){
    const buildingsGeoJSON = new VectorImageLayer({
        source: new VectorSource({
            url: path,
            format: new GeoJSON()
        }),
        opacity: 0.8,
        visible: true,
        zIndex: 1,
        title: 'buildingsGeoJSON',
    });
    return buildingsGeoJSON;
}

function setPopup(map){
    console.log("here");  
    let container = document.getElementById('popup');
    let content = document.getElementById('popup-content');
    let closer = document.getElementById('popup-closer');
    
    let overlay = new Overlay({
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
        let infoTxt = `<p>`
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