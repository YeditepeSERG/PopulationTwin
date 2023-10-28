import {getEditAreaListByAccount, getViewAreaListByAccount} from "./userRepository.js";
import {saveBuildingsData} from "./data.js"

generatePropertiesFormByConfig("./properties.json", "properties-form")
.then((message) => {
    var selectedFeature = null;
    let featureProperties;
    
    const areasElements = document.getElementById('areas');
    const editDiv = document.getElementById("editDiv");
    const saveToJsonButton = document.getElementById("saveToJsonButton");
    const editToggleButton = document.getElementById("editToggle"); 
    const unsavedChangesText = document.getElementById("unsavedChangesText");
    const getOSMDataButton = document.getElementById("getOSMData");
    const propertiesSidebar = document.getElementById("propertiesSidebar");
    const savePropertiesButton = document.getElementById("savePropertiesButton");
    const deleteBuildingButton = document.getElementById("deleteBuildingButton");
    const closePropertiesButton = document.getElementById("closebtn");
    const popupContainer = document.getElementById('popup');
    const popupContent = document.getElementById('popup-content');
    const popupCloser = document.getElementById('popup-closer');
    
    const vectorSource = new ol.source.Vector({wrapX: false});
    const vectorLayer = new ol.layer.VectorImage({
        source: vectorSource,
        opacity: 0.8,
        visible: true,
        zIndex: 1,
    });
    const draw = new ol.interaction.Draw({
        source: vectorSource,
        type: 'Polygon',
        condition: function (event) {
            const pointerEvent = event.activePointers[0];
            return pointerEvent.button === 0;
        },
    });
    const overlay = new ol.Overlay({
        element: popupContainer,
        autoPan: {
          animation: {
            duration: 250,
          },
        },
    });
    
    editDiv.classList.add('d-none');
    saveToJsonButton.style.display = 'none';
    editToggleButton.checked = false;
    unsavedChangesText.style.display = 'none';
    getOSMDataButton.style.display = 'none';
    
    map.addLayer(vectorLayer);
    map.addOverlay(overlay)
    setUpAccordingToEditor();
    areaSelection();
    
    map.on('click', (e)=>{
        map.forEachFeatureAtPixel(e.pixel, feature => {
          let isDrawing = feature.getStyle() === null;
          if (isDrawing) return;
    
          setMapInteraction("remove");
    
          // polygon feature
          if (window.location.pathname === "/admin.html" && editToggleButton.checked){
              closeEditNav();
              selectedFeature = feature;
              openEditNav();
              overlay.setPosition(undefined);
              popupCloser.blur();
          } 
          // edit button off
          else {
              let infoTxt = `<p>`
              for (var key in feature.values_){
                if(listOfNotTranferred.includes(key) || key == "geometry"){
                  continue;
                }
                infoTxt = infoTxt + `${key}: ${feature.values_[key]}<br>`;
              }
              infoTxt = infoTxt + `</p><code>`;
      
              popupContent.innerHTML = infoTxt;
              overlay.setPosition(e.coordinate);
          }
        });
    });
    
    // on right mouse click
    map.getViewport().addEventListener('contextmenu', function (event) {
        event.preventDefault();
        if (event.button === 2) {
            draw.removeLastPoint();
        }
    });
    
    popupCloser.onclick = function () {
        overlay.setPosition(undefined);
        popupCloser.blur();
        return false;
    };
    
    draw.on('drawend', function (event) {
        unsavedChangesText.style.display = 'block';
        selectedFeature = event.feature;
        setMapInteraction("remove");
        openEditNav();
    });
    
    editToggleButton.onclick = () => {
        setMapInteraction("toggle");
        if (editToggleButton.checked) {
            saveToJsonButton.style.display = 'block';
            getOSMDataButton.style.display = 'block';
        }
        else {
            saveToJsonButton.style.display = 'none';
            getOSMDataButton.style.display = 'none';
            closeEditNav();
        }
    };
    
    saveToJsonButton.onclick = () => {
        let infos = [];
    
        let features = vectorLayer.getSource().getFeatures();
        features.forEach(feature => {
            let coords = getCoordinatesByFeature(feature);
            var newBuilding = getNewBuildingByFeature(feature);
            if (newBuilding) {
                let info = {
                    "newBuilding": newBuilding,
                    "coordinatesList": coords,
                };
                infos.push(info);
            }
        });
    
        addNewBuildingToJsonByInfos(infos)
        .then(message => {
            reloadLayer();
        });
        unsavedChangesText.style.display = 'none';
        vectorSource.clear();
    };
    
    getOSMDataButton.onclick = async () => {
        if(!confirm("This will delete your existing data and get OSM building coordinates.\nDo you want to continue?")) {
            return;
        }
    
        const areaOption = areasElements.options[areasElements.selectedIndex];
        const area = getInfosOfAreas(areaOption);
        await saveBuildingsData(area)
        .then(() => {
            location.reload();
        });
    };
    
    savePropertiesButton.onclick = () => {
        let buildingType = document.getElementById("building-type").value;
        let buildingName = document.getElementById("building-name").value;
        let buildingPopulation = parseInt(document.getElementById("building-population").value) || "";    
    
        let rawProperties = {
            "buildingType": buildingType,
            "name": buildingName,
            "population": buildingPopulation,
        };
    
        try {
            isPropertiesEmpty(rawProperties);
        } catch (error) {
            alert(error.message);
            return;
        }
    
        selectedFeature.setProperties(rawProperties);
        if(selectedFeature.getProperties().id){
            let id = selectedFeature.getProperties().id;
            let building = getNewBuildingByFeature(selectedFeature);
            lastID--;
            updateToInfOfBuildingByID(id, building);
            selectedFeature.setStyle(getStyleByColor(building.getColor()));
        }
    
        closeEditNav();
        setMapInteraction("add");
    };
    
    deleteBuildingButton.onclick = async () => {
        let id = selectedFeature.getProperties().id;
        if (id) {
            deleteBuildingByID(id)
            .then(message => {
                reloadLayer();
            });
        }
        else{
            vectorLayer.getSource().removeFeature(selectedFeature);
            selectedFeature = null;
        
            if (vectorLayer.getSource().getFeatures().length === 0) {
                unsavedChangesText.style.display = 'none';
            }
        }
        closeEditNav();
        setMapInteraction("add");
    }
    
    closePropertiesButton.onclick = () => {
        closeEditNav();
        setMapInteraction("add");
    };
    
    function openEditNav() {
        propertiesSidebar.style.width = "300px";
    
        // default values
        let buildingType = document.getElementById("building-type").value;
        let name = "";
        let population = "";
    
        if (selectedFeature) {
            selectedFeature.setStyle(getStyleForEditing());
            
            featureProperties = selectedFeature.getProperties();
            buildingType = featureProperties.buildingType ?? buildingType;
            name = featureProperties.name ?? name;
            population = featureProperties.population ?? population;
        }
    
        document.getElementById("building-type").value = buildingType;
        document.getElementById("building-name").value = name;
        document.getElementById("building-population").value = population;
    
        let focusElement = document.getElementById("building-name");
        focusElement.focus();
        focusElement.setSelectionRange(focusElement.value.length, focusElement.value.length);
    }
    
    function closeEditNav() {
        propertiesSidebar.style.width = "0px";
    
        if (selectedFeature) {
            let properties = selectedFeature.getProperties();
            let color;
            if (properties.population){
                let riskScale = determineRiskScale(properties.population);
                color = getColorByRiskScale(riskScale);
            }
            if(!selectedFeature.getProperties().id){
                color = "white";
            }
            selectedFeature.setStyle(getStyleByColor(color));
        }
    }
    
    function setMapInteraction(mode) {
        let isInteractionOn = map.getInteractions().getArray().includes(draw);
    
        if (mode === "add" && !isInteractionOn) {
            map.addInteraction(draw);
        }
        else if (mode === "remove" && isInteractionOn) {
            draw.abortDrawing();
            map.removeInteraction(draw);
        }
        else if (mode === "toggle") {
            if (isInteractionOn) {
                setMapInteraction("remove");
            }
            else {
                setMapInteraction("add");
            }
        }
    }
    
    function getNewBuildingByFeature(feature){
        featureProperties = feature.getProperties();
        let featureBuildingType = featureProperties.buildingType;
        let featureName = featureProperties.name;
        let featurePopulation = featureProperties.population;
    
        try{
            isPropertiesEmpty(featureProperties);
            const newBuilding = new Building(featureBuildingType, featureName, featurePopulation);
            return newBuilding;
        }
        catch{
            return null;
        }
    }
    
    function getCoordinatesByFeature(feature){
        let multiCoords = feature.getGeometry().getCoordinates();
        multiCoords.forEach((coords, i) => {
            coords.pop();
            coords.forEach((element, i) => {
                coords[i] = ol.proj.transform(element, 'EPSG:3857', 'EPSG:4326');
            });
        });
        return multiCoords;
    }
    
    function isPropertiesEmpty(properties){
        for (let key in properties) {
            if(properties[key] === ""){
                throw new Error(`${key} field not entered!`);
            }
        }
    }
    
    function editConstraint(){
        const email = window.sessionStorage.getItem("email")
        
        getEditAreaListByAccount(email).then(data=>{
            const areasElements = document.getElementById('areas');
            // var areaValue = areasElements.options[areasElements.selectedIndex].value;
            areasElements.addEventListener("click", ()=>{
                var areaValue = areasElements.options[areasElements.selectedIndex].value;
                let editPermission = data.includes(areaValue)
                if(editPermission){
                    editDiv.classList.remove('d-none');
                }else{
                    editDiv.classList.add('d-none');
                }
            })
        })
    }
    
    async function setUpAccordingToEditor(){
        const email = window.sessionStorage.getItem("email");
        var listOfAreas = [];
    
        await getViewAreaListByAccount(email)
        .then(viewList => {
            viewList.forEach(area => {
                listOfAreas.push(area);
            })
        })
    
        await getEditAreaListByAccount(email)
        .then(editList => {
            editList.forEach(area => {
                listOfAreas.push(area);
            })
        })
    
        listOfAreas = Array.from(new Set(listOfAreas));
        addOptionToSelectByID('areas', listOfAreas);
        editConstraint();
    }
    
    function areaSelection(){
        areasElements.addEventListener('click', function() {
            let areaValue = areasElements.options[areasElements.selectedIndex].value;
            let info = getInfosOfAreas(areaValue);
            pathOfMap = info.path;
            map.setView(info.view);
            changeLayerByPath();
        });
    } 
    
    function changeLayerByPath(){
        if (window.location.pathname === "/admin.html"){
            editToggleButton.checked = false;
            map.removeInteraction(draw);
            reloadLayer();
    
            getIDOfLastBuilding()
            .then(id => {
                lastID = id;
            });
        }
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
        buildingsGeoJSON = loadGeoJSON(pathOfMap);
        map.addLayer(buildingsGeoJSON);
        drawShapesOnMap(buildingsGeoJSON);
    }
});
