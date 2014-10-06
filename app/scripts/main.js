var map;
require(["_", "scripts/d3", "c3", "Chart", "esri/map", "esri/layers/ArcGISTiledMapServiceLayer", 
    "esri/layers/FeatureLayer", "dojo/domReady!"], function(_, d3, c3, Chart, Map, TiledLayer, FeatureLayer) { 
 
  var featureLayer = new FeatureLayer("http://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Airports/FeatureServer/0",{
    outFields: ["*"]
  });
 
  map = new Map("map", {
    center: [-92.049, 41.485],
    zoom: 4,
    basemap: "topo",
    smartNavigation: false
  });
 
  map.addLayer(featureLayer);
  window.c3 = c3; //AMD HACK! Need c3 to be defined in Chart.js

  //just get the data and chart it!
  var url = featureLayer.url + '/query?where=1%3D1&returnGeometry=false&outFields=*&orderByFields=&f=json';
  d3.json(url, function(error, json) {
    if (error) return console.warn(error);
    var data = json;
    var selectedAttribute = "ELEV";
    Chart.buildOptions(data, selectedAttribute);
  });
});
