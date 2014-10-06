var map;
require(["scripts/d3", "scripts/c3", "esri/map", "esri/layers/ArcGISTiledMapServiceLayer", 
    "esri/layers/FeatureLayer", "dojo/domReady!"], function(d3, c3, Map, TiledLayer, FeatureLayer) { 
 
  var featureLayer = new FeatureLayer("http://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Airports/FeatureServer/0",{
    outFields: ["*"]
  });
 
  map = new Map("map", {
    center: [-92.049, 41.485],
    zoom: 4,
    basemap: "streets",
    smartNavigation: false
  });
 
  console.log('d3', d3);
  console.log('c3', c3);
  console.log('featureLayer', featureLayer);
 
  map.addLayer(featureLayer);
});
