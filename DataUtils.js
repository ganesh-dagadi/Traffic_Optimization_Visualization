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
    //Here the corners of roads that are not connected to any of the other roads,
    //Dont form junctions, however in the next step while generating subroads,
    //We need those junctions too.. Thus we consider the corners of every road 
    //If a junction is not already registered, we register it
    data.features.forEach((feature) => {
      if(seenCoordinates.indexOf(feature.geometry.coordinates[0]) == -1){
        response.features.push({
          type: "Feature",
          properties: { "marker-color": "red" },
          geometry: {
            coordinates: feature.geometry.coordinates[0],
            type: "Point",
          },
        });
      }
      if(seenCoordinates.indexOf(feature.geometry.coordinates[feature.geometry.coordinates.length -1]) == -1){
        response.features.push({
          type: "Feature",
          properties: { "marker-color": "red" },
          geometry: {
            coordinates: feature.geometry.coordinates[feature.geometry.coordinates.length -1],
            type: "Point",
          },
        });
      }
      
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

  static generateSubRoads(juncData , roadsData){
    const colors = ["red" , "blue" , "green" , "brown" , "black" , "white" , "purple" , "yellow" , "pink"]
    const res = {
      type : "FeatureCollection",
      features : []
    }

    const juncs = []
    juncData.features.forEach(feature=>{
      juncs.push(String(feature.geometry.coordinates))
    })
    console.log(juncs)
    //Now we have a 1D array of strings where each element is an array of coordinates
    roadsData.features.forEach(feature=>{
      let junFound = false
      let prevIndex = 0;
      for(let i = 0 ; i < feature.geometry.coordinates.length ; i++){
        if(juncs.indexOf(String(feature.geometry.coordinates[i])) != -1){
          if(junFound){
            res.features.push({
              type: "Feature",
              properties: { "stroke": colors[i % 9] },
              geometry: {
                coordinates: feature.geometry.coordinates.slice(prevIndex , i+1),
                type: "LineString",
              },
            })
            prevIndex = i
          }else{
            junFound = true;
            prevIndex = i;
          }
        }
      }
      junFound = false;
      prevIndex= -1;
    })
    console.log(JSON.stringify(res))
  }
}

module.exports = DataUtils
