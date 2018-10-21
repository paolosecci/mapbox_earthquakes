usa_center = [37.0902, -95.7129];
api_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// function createLegend(eq_ranks){
//   console.log("building legend...");
//   d3.select(".legend").html = [
//     "<p class='u_3'>Under 3: " + eq_ranks.u_3.length + "</p>",
//     "<p class='u_45'>Under 4.5: " + eq_ranks.u_45.length + "</p>",
//     "<p class='u_infinity'>4.5+: " + eq_ranks.u_infinity.length + "</p>"
//   ].join("");
// }

function createMap(earthquakes){

  // Create the tile layer that will be the background of our map
  var satmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Satellite Map": satmap
  };

  // Create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center: [10,0],
    zoom: 2,
    layers: [satmap, earthquakes]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps,{
    collapsed: false
  }).addTo(map);
}

function createMarkers(re){

  var eq_markers = [];
  for(var i = 0; i < re.features.length; i++){

      var f = re.features[i];

      var under_three = [];
      var under_fourfive = [];
      var fourfiveplus = [];

      function renderColor(mag){
        if(mag < 3){
            under_three.push(f);
            return "red";
        }else if (mag < 4){
            under_fourfive.push(f);
            return "orange";
        }else if (mag < 4.5){
            under_fourfive.push(f);
            return "yellow";
        }else if (mag < 5){
            fourfiveplus.push(f);
            return "green";
        }else if (mag < 5.5){
            fourfiveplus.push(f);
            return "blue";
        }else if (mag < 6.5){
            fourfiveplus.push(f);
            return "purple";
        }else{
            fourfiveplus.push(f);
            return "black";
        }

      };

      var eq_rank_forlegend = {
          u_3: under_three,
          u_45: under_fourfive,
          u_infinity: fourfiveplus
      };

      var eq_marker = L.circleMarker([f.geometry.coordinates[1], f.geometry.coordinates[0]], {
        color: renderColor(f.properties.mag),
        fillColor: renderColor(f.properties.mag),
        radius: f.properties.mag ** 1.7
      }).bindPopup("<h2 align='center'>" + f.properties.place + "</h2><h3 align='center'>Magnitude: " + f.properties.mag + "</h3><hr><p>" + new Date(f.properties.time) + "</p>");

      eq_markers.push(eq_marker);
  }

  createMap(L.layerGroup(eq_markers));
  //createLegend(eq_rank_forlegend);
}


// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
d3.json(api_url, createMarkers);
