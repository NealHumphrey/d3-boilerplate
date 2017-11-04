"use strict";

var bp = {};

bp.base = {
    /*
    Every chart should have (at least) 3 public methods:
    setup: creates the SVG object, an innerChart g object, and initializes defaults
    resize: changes anything that needs to adjust if the size of the svg changes, including the first time
    update: changes anything that needs to adjust if the data is updated or some other setting changes, 
            including the first time.
    */

    /*
    setup: function(container){
      //Custom charts should override this method themselves
      this.baseSetup(container);
      return this; //setup should always return chart so that it can be method chained
    },
    resize: function(container){
      //Custom charts should override this method themselves
      this.baseResize(container);
      this.instant_update(); //It's recommend that resize() functions end with an instant_update, as
                             //update redraws the contents and instant_update ignores delay/duration settings
    },
    update: function(container){
      //Custom charts should override this method themselves
      this.baseUpdate(container);
      return this; //update should always return chart so that it can be method chained
    },
    */

    create: function(){
      /*
      An alias for resize, to make the public interface slightly more intuitive. 
      
      Example:

      myChart = new ChartProto('.myContainerSelector')
                .width(500)
                .height(200)
                .create()
      */

      var chart = this
      //resize performs all the stuff needed to draw the chart the first time
      chart.resize()
      return chart

    },
    setup: function(container) {
      /*
      setup initializes all the default parameters, and create the container objects that are only created once. 
      This method is run automatically when a new object is created

      Any chart that inherits from this prototype should have a setup method, which can benefit from the contents
      of this method if they choose to use it, e.g.:

      setup: function(container){
        this.baseSetup(container);
      }
      */

      var chart = this; 

      //Setup defaults
      chart._data = []
      chart._field = null;
      chart._label = null //"field" will be returned as placeholder by getter if _label is null
      chart._width = 400;
      chart._height = 300;
      chart._margin = {top:10,right:10,bottom:10,left:10};
      chart._container = container
      chart._autoresize = {width:false,height:false};

      chart._delay = 200
      chart._duration = 1000

      //Create graph objects needed
      chart.svg = d3.select(chart.container())
        .append("svg")
        .attr('width', chart.width())
        .attr('height', chart.height());

      chart.innerChart = this.svg.append('g')
            .classed("chart",true)

      return chart;

    },
    resize: function(){
      /*
      Anything that needs to be changed on resize should go in here. 
      Note, this function also sets up the initial sizes of these elements because
      it is run the first time the graph is created as well. 

      Note, resize also calls update(), because anything that needs to change in update
      also needs to be changed in resize. 

      Inherited charts should have a _resize function that is called at the end of this public method
      */

      var chart = this;
      chart.svg
        .attr('width', chart._width)
        .attr('height', chart._height)
        .transition()
        .delay(chart.delay())
        .duration(chart.duration())

      chart.innerChart.attr("transform", "translate(" + this.margin().left + "," + this.margin().top + ")");

    }, 
    update: function(data){
      /*This is the public method used to call the private _update method of each chart
      
      Every chart that inherits from ChartProto should include an _update method, which 
      redraws the inner contents of the chart when needed. When the _update method is called, 
      it uses this.data as the basis of the drawing. 

      This public method ensures a consistent approach to the update method for all charts:
      Users can call the method with or without new data - if no data is passed, the previously
      used data will be used. Typically this will occur when the user has updated some other 
      property, such as 'field' or some other setting. 

      When using method chaining to update the properties of the graph, use the update() function
      to trigger the changes in the graph itself. 
      */
      var chart = this
      
      if (data != undefined) {

        chart.data(data);

        //Calculated fields as necessary
        //TODO maybe move this into the data getter/setter?
        this.minValue = d3.min(chart.data(), function(d) { 
              if (chart.field()) return d[chart.field()];
              return null;
        });
        this.maxValue = d3.max(chart.data(), function(d) { 
              if (chart.field()) return d[chart.field()];
              return null;
        });

      };

    },      
    instant_update: function(){
      /*
      Overrides the .duration() and .delay() of a chart before applying .update()
      then restores the delay/duration settings. 
      */
      var chart = this;
      //Make the resize happen instantaneously - necessary when update uses transitions for normal updates
      var old_duration = chart.duration()
      var old_delay = chart.delay()
      chart.duration(0)
      chart.delay(0)
      
      chart.update();

      //Reset the transition settings
      chart.duration(old_duration)
      chart.delay(old_delay)

      return chart;
    },
    extend: function(obj) {
      /*
      Simple mapping function that assigns all elements of an object
      to this object. Used to avoid having to type `bp.chartname.functionname = ` 
      when adding new properties to a chart. 
      */
      for(var i in obj){
          this[i] = obj[i];
      };
    },

    //TODO not used currently
    sort: function(field, direction) {
        chart.data.sort(function(a, b) { 
          if (direction === 'asc') return a[chartOptions.sort.field] - b[chartOptions.sort.field];
          return b[chartOptions.sort.field] - a[chartOptions.sort.field]; 
        });             
    },

    //Calculated attributes accessible from all functions
    innerHeight: function(_){
        if (!arguments.length) {
            var innerHeight = (this._height - this.margin().top - this.margin().bottom)
            return innerHeight;
        }
        console.log("can't set inner height, it's calculated")
        return this;
    },
    //Calculated attributes accessible from all functions
    innerWidth: function(_){
        if (!arguments.length) {
            var innerWidth = (this._width - this.margin().left - this.margin().right)   
            return innerWidth;
        }
        console.log("can't set inner height, it's calculated")
        return this;
    },


    /*
    Custom getter/setters for chart proto properties
    */
    data: function(_){
        if (!arguments.length) return this._data;
        this._data = _;
        return this;
    },
    width: function(_){
        if (!arguments.length) return this._width;
        this._width = _;
        return this;
    },
    height: function(_){
        if (!arguments.length) return this._height;
        this._height = _;
        return this;
    },

    //Name of the key in the data object to be used for the primary numeric data, e.g. "value" with data of shape [{'id':'point 1', 'value': 100 }]
    field: function(_){
        if (!arguments.length) return this._field;
        this._field = _;
        return this;
    },
    //Name of the key in the data object to be used for the displayed name of a data point, e.g. "id" with data of shape [{'id':'point 1', 'value': 100 }]
    label: function(_){
        if (!arguments.length) {
            //Return a default label if none exists yet
            if (this._label == null) return this._field;
            return this._label
        };
        this._label = _;
        return this;
    },
    margin: function(_){
        if (!arguments.length) return this._margin;
          for (var key in _ ) {
            this._margin[key] = _[key]
          }
        return this;
    },
    container: function(_){
        if (!arguments.length) return this._container;
        this._container = _;
        return this;
    },
    delay: function(_){
        if (!arguments.length) return this._delay;
        this._delay = _;
        return this;
    },
    duration: function(_){
        if (!arguments.length) return this._duration;
        this._duration = _;
        return this;
    },

    autoresize: function(_){
      var chart = this;
      if (!arguments.length) return this._autoresize;
      this._autoresize = _;


      var run_autoresize = function(){
        var containerElement = d3.select(chart.container()).node();
        if (chart.autoresize()['height']){
          var height = containerElement.clientHeight;
          chart.height(height);
        }
        if (chart.autoresize()['width']) {
          var width = containerElement.clientWidth;
          chart.width(width);  
        }
        if (chart.autoresize()['width'] || chart.autoresize()['height']) {
          chart.resize();
        }

        
      };

      if (chart._autoresize['width'] || chart._autoresize['height']) {
          var containerElement = d3.select(chart.container()).node();
          addResizeListener(containerElement, run_autoresize );
        } else {
          //TODO TODO TODO!!!
          //for the autoresize getter/setter
        //removeResizeListener(resizeElement, resizeCallback);
        }
 
      return this;
    }

};
