(function () {
  'use strict';

  var Chart = {
    options: {
      "type": "bar",
      "dataSource": null,
      "oid": "",
      "ratio": 0.90,
      "regions": [],
      "pattern": "rgb(49,130,189)",
      "statistics": {},
      "xHeight": 50,
      "xRotate": 0,
      "xLabel": "",
      "yLabel": "Count"
    },

    initChart: function(id) {
      var self = this;
      var options = this.options;
      
      var chart = c3.generate({
          bindto: document.getElementById("chart"),
          padding: {
            top: 0,
            right: 40,
            bottom: 20,
            left: 60
          },
          data: {
            type: options.type,
            columns: options.values,
            selection: {
              enabled: true,
              grouped: true,
              multiple: true
            }
          },
          bar: {
            width: {
                ratio: options.ratio // this makes bar width n% of length between ticks
            }
          },
          tooltip: {
            format: {
              title: function(d, i) {
                var a, b;
                if ( !isNaN(options.xAxis[d]) ) {
                  a = options.xAxis[d].toLocaleString();
                  b =  (options.xAxis[d+1]) ? ' to '+options.xAxis[d+1].toLocaleString() : "";
                } else {
                  a = options.xAxis[d];
                  b = "";
                }
                return a + b;
              },
              value: function(value, ratio, d) {
                return value + " Features";
              } 
            }
          },
          zoom: { enabled: false },
          color: {
            pattern: [ options.pattern ]
          },
          legend: {
            show: false
          },
          grid: {
            y: {
              lines: [{value: 0}]
            }
          },
          regions: options.regions,
          axis: {
            x: {
              //type: 'category',
              //categories: options.xAxis,
              tick: {
                fit:true,
                rotate: options.xRotate,
                culling: {
                  max: options.maxLabels
                },
                format: function (x, y) { 
                  if (options.type === "esriFieldTypeDate") {
                    return moment(parseInt(options.xAxis[x], null)).format('MMM Do, YYYY');
                  } else if ( !isNaN(options.xAxis[x]) ) {
                    var a = (options.xAxis[x]) ? options.xAxis[x].toLocaleString() : "";
                    return a;
                  } else {
                    return options.xAxis[x];
                  }
                }
              },
              height: options.xHeight,
              label: {
                text: options.xLabel,
                position: 'outer-left'
              }
            },
            y: {
              label: {
                text: options.yLabel,
                position: 'outer-bottom'
              }
            }
          }
        });

      this.chart = chart;
    },

    buildOptions: function(data, selectedAttr) {
      var res = data;
      
      var self = this;
      var data = [],
        numericAttrs = [],
        stringAttrs = [],
        blacklist = ["OBJECTID", "FID", "STATE_FIPS", "OBJECTID_1"];

      var field;
      _.each(res.fields, function(f, i) {
        if (f.name === selectedAttr ) {
          field = f;
        }
      });

      var  regions = null,
        values = [],
        xAxis = [],
        hist,
        min,
        max,
        xRotate,
        unbinned = {},
        attribute = field.name,
        oid = res.objectIdFieldName,
        attrs = _.pluck( res.features, 'attributes' ),
        ratio = null;

      //blacklist
      if ( _.contains(blacklist, attribute.toUpperCase() ) ) {
        return;
      }

      //all numeric types for now
      //TODO break these into separate functions
      if ( field.type !== "esriFieldTypeString" && field.type !== "esriFieldTypeDate" ) {
        
        var nvals = _.pluck( attrs, attribute);
        max = _.max(nvals);
        min = _.min(nvals) || 0;
        
        //calculate bins
        //default 15 bins 
        var x = d3.scale.linear()
          .domain([min, max])
          .range([min, max]);
        
        //TODO do not force 50, find best number, max 50
        var numbins = Math.round(Math.sqrt(nvals.length));
        if ( numbins > 50 ) {
          numbins = 50;
        }
        
        hist = d3.layout.histogram()
          .bins(numbins)
          (nvals);

        //binned data (bars, lines)
        values = _.pluck(hist, 'y'); //y axis counts
        xAxis = self._getXValues(hist, nvals); //xaxis values
        values.unshift(attribute); //c3.js needs y (values) to start with selected attribute name


      } else {
        //strings
        //need to calculate counts by string type for use in charts
        var vals = _.pluck( attrs, attribute); //get values as usual
        
        //vals.sort(); //sorted charts 
        vals = _.sortBy(vals, function(num) {
          return num;
        });

        //get counts by attr value type
        var counts = _.groupBy(vals, function (item) {
          return item;
        });

        //store ids (oids) for chart/map interaction
        var h = [];
        _.each(counts, function(c) {
          h.push(c);
        });
        
        //create new array to pass to data array
        values.push(attribute);
        _.each(counts, function(f, i) {
          var val = parseInt(f.length, null);
          values.push(val);
          xAxis.push(i);
        });

      }

      self.options.values = [];
      self.options.values.push(values);
      self.options.xAxis = xAxis;
      self.options.xLabel = selectedAttr;
      this.initChart("chart");
    },

    /*
    * Grab x values from d3 hist, return an array to pass to chart
    * @param {array} hist     d3 calculated histograms
    * @param {array} vals
    */
    _getXValues: function(hist, vals) {
      var dec = false;
      _.each(vals, function(v) {
        var d = v % 1 !== 0;
        if ( d === true ) {
          dec = true;
        }
      });

      var arr = _.pluck(hist, 'x'), values = [];
      _.each(arr, function(val) {
        if ( dec === true ) {
          values.push(parseFloat(val).toFixed(2));
        } else {
          values.push(parseInt(val, null));
        }
      });
      return values;
    }

  }
  if (typeof define === 'function' && define.amd) {
    define("Chart", ["d3"], Chart);
    window.Chart = Chart;
  } else if ('undefined' !== typeof exports && 'undefined' !== typeof module) {
    module.exports = Chart;
  } else {
    window.Chart = Chart;
  }
})(window);