// location
class Node {
    constructor(id, lat, lon) {
        this.id = id;
        this.lat = lat;
        this.lon = lon;
    }

    getCooords() {
        return [this.lon, this.lat]
    }

    static getNodeObjByID(nodeObjArray, id) {
        for (let node of nodeObjArray) {
            if (node.id === id) return node;
        }
        return null;
    }

    static getNodeObjsByIDs(nodeObjArray, ids) {
        let nodeObjs = [];
        for (let id of ids) {
            let nodeObj = this.getNodeObjByID(nodeObjArray, id);
            if (nodeObj) nodeObjs.push(nodeObj);
        }
        nodeObjs.pop();
        return nodeObjs;
    }
}

// building
class Way {
    constructor(id, nodeIDs, tags, nodeObjArray) {
        this.id = id;
        this.nodes = Node.getNodeObjsByIDs(nodeObjArray, nodeIDs);
        this.tags = tags;
    }

    getCooords() {
        let coords = [];
        this.nodes.forEach(node => {
            coords.push(node.getCooords());
        });
        return [coords];
    }
}

function getBuildingsData(extentCoordinates) {
    const projectedCoords = projEPSG(extentCoordinates, 'EPSG:3857', 'EPSG:4326');
    const switchedCoords = switchLatLon(projectedCoords);

    const endpoint = 'https://overpass-api.de/api/interpreter';
    const bbox = switchedCoords.join(',');
    const query = `
        [out:json];
        (
        way[building](${bbox});
        );
		(._;>;);
        out;
    `;
    const encodedQuery = encodeURIComponent(query);

    return new Promise((resolve, reject) => {
        fetch(`${endpoint}?data=${encodedQuery}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const elements = data.elements;
                let nodes = [];
                let ways = [];

                elements.forEach(element => {
                    let type = element.type;

                    if (type === "node") {
                        let node = new Node(element.id, element.lat, element.lon);
                        nodes.push(node);
                    } else if (type === "way") {
                        let way = new Way(element.id, element.nodes, element.tags, nodes);
                        ways.push(way);
                    }
                });

                resolve(ways);
            })
            .catch(error => {
                reject(error);
            });
    });
}

export async function saveBuildingsData(area) {
    let geojsonPath = area.path;
    let extentCoordinates = area.view.getProperties().extent;

    await getBuildingsData(extentCoordinates)
        .then(async ways => {
            let data = {
                "type": "FeatureCollection",
                "features": [],
            };
            let id = 1;

            ways.forEach(way => {
                let wayData = {
                    "type": "Feature",
                    "properties": {
                        "id": id++,
                        "buildingName": undefined,
                    },
                    "geometry": {
                        "coordinates": undefined,
                        "type": "Polygon",
                    },
                };

                wayData.properties.buildingName = way.tags.name;
                wayData.geometry.coordinates = way.getCooords();
                data.features.push(wayData);
            });

            await HTTPDataHandling.sendDataChunkByChunk(geojsonPath, data);
        })
        .catch(error => {
            console.error('Data fetch error:', error);
        });
}

function projEPSG(coordinateArray, source, destination) {
    return ol.proj.transformExtent(coordinateArray, source, destination);
}

function switchLatLon(coordinateArray) {
    let switchedCoords = [];
    [switchedCoords[0], switchedCoords[1]] = [coordinateArray[1], coordinateArray[0]];
    [switchedCoords[2], switchedCoords[3]] = [coordinateArray[3], coordinateArray[2]];
    return switchedCoords;
}
