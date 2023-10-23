let pathOfMap = './data/yeditepe.geojson';
let lastID = 0;

const areas = [
    {
      "name": 'yeditepe',
      "path": './data/yeditepe.geojson',
      "view": 
        new ol.View({
          center: [3245075.5956414873, 5008280.403576283],
          zoom: 17,
          maxZoom: 20,
          extent:[3243765.5304893167,5007166.253738531,3246089.254809256, 5009211.711301061]
        }),
    },
    {
      "name": 'kadikoy',
      "path": './data/kadikoy.geojson',
      "view": 
        new ol.View({
          center: [3231082.4237034055, 5011007.289758972],
          zoom: 17,
          maxZoom: 20,
          extent:[3228902.9847011017, 5007703.744756088,3234903.202754916, 5013364.02755034]
        }),
    }
]

const populationRanges = [
    {
        "Risk": 4,
        "Density": "EXTREMEHIGH",
        "MinPop": 2000
    },
    {
        "Risk": 3,
        "Density": "HIGH",
        "MinPop": 1200
    },
    {
        "Risk": 2,
        "Density": "MID",
        "MinPop": 800
    },
    {
        "Risk": 1,
        "Density": "LOW",
        "MinPop": 400
    },
    {
        "Risk": 0,
        "Density": "EXTREMELOW",
        "MinPop": 0
    }
]

const listOfColorByRisk = [
    {
        "Risk": 4,
        "Color": "red"
    },
    {
        "Risk": 3,
        "Color": "orange"
    },
    {
        "Risk": 2,
        "Color": "yellow"
    },
    {
        "Risk": 1,
        "Color": "green"
    },
    {
        "Risk": 0,
        "Color": "grey"
    }
]

const buildingList = [
    {
        "Type": "Apartment",
        "ImgPath": null
    },
    {
        "Type": "Cafe",
        "ImgPath": null
    }    
]