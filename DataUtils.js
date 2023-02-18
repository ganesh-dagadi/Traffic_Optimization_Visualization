class DataUtils {
  constructor() {}
  static generateJunctions(data) {
    const junctions = [];
    const seenCoordinates = [];
    const response = {
      "type": "FeatureCollection",
      "features": []
    }
    data.features.forEach((feature) => {
      feature.geometry.coordinates.forEach((coordinate) => {
        let currCoordinate = String(coordinate);
        if (seenCoordinates.indexOf(currCoordinate) == -1) {
          seenCoordinates.push(currCoordinate);
        } else {
          response.features.push({
            type: "Feature",
            properties: { "marker-color": "red" },
            geometry: {
              coordinates: coordinate,
              type: "Point",
            },
          });
        }
      });
    });
    return response
  }

  static cleanDataToRoads(data){
    const roadTypes = ["motorway" , "trunk" , "primary" , "secondary" , "tertiary" , "residential" , "motorway_link", "trunk_link" ,"primary_link" , "secondary_link" , "tertiary_link" , "living_street" , "service"]
    const response= {
      "type": "FeatureCollection",
      "features": []
    }

    let i = 0;
    for(i = 0 ; i < data.features.length; i++){
      if(data.features[i].geometry.type == "LineString" && roadTypes.indexOf(data.features[i].properties.highway) != -1){
        response.features.push(data.features[i])
      }
    }
    return response;
  }
}

module.exports = DataUtils
