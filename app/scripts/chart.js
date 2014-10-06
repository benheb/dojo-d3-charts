(function () {
  'use strict';

  Chart({

    initChart: function(options) {
      var self = this;
      
      console.log('options', options);

      var chart = c3.generate({
          bindto: self.$.chart,
          padding: {
            top: 0,
            right: 40,
            bottom: 20,
            left: 60
          },
          data: {
            type: this.type,
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
    }
  });
});