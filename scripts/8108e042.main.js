var map;require(["_","scripts/d3","c3","Chart","esri/map","esri/layers/ArcGISTiledMapServiceLayer","esri/layers/FeatureLayer","dojo/domReady!"],function(a,b,c,d,e,f,g){var h=new g("http://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Airports/FeatureServer/0",{outFields:["*"]});map=new e("map",{center:[-92.049,41.485],zoom:4,basemap:"topo",smartNavigation:!1}),map.addLayer(h),window.c3=c;var i=h.url+"/query?where=1%3D1&returnGeometry=false&outFields=*&orderByFields=&f=json";b.json(i,function(a,b){if(a)return console.warn(a);var c=b,e="ELEV";d.buildOptions(c,e)})});