import React from 'react';
import {render} from 'react-dom';
import ReactDOM from 'react-dom';
import ReactNativeSlider from "react-html5-slider";
import ReactFauxDOM from 'react-faux-dom';

var parentWidth = 500;
    var parentHeight = 500;
    var margin = {top: 5, right: 10, bottom: 100, left: 40},
        margin2 = {top: 240, right: 10, bottom: 80, left: 40},
        width = parentWidth - margin.left - margin.right,
        height = parentHeight - margin.top - margin.bottom,
        height2 = parentHeight - margin2.top - margin2.bottom,
        transform = "translate(" + margin.left + "," + margin.top + ")",
        transform2 = "translate(" + margin2.left + "," + margin2.top + ")";

var LineChart = React.createClass({

  getInitialState: function(){
    var data = this.props.data;
    var x = d3.time.scale().range([0, width]),
        x2 = d3.time.scale().range([0, width]),
        y = d3.scale.linear().range([height, 0]),
        y2 = d3.scale.linear().range([height2, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom"),
        xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
        yAxis  = d3.svg.axis().scale(y).orient("left");

    var area = d3.svg.area()
      .interpolate("monotone")
      .x(function(d) { return x(d.date); })
      .y0(height)
      .y1(function(d) { return y(d.close); });

    var area2 = d3.svg.area()
      .interpolate("monotone")
      .x(function(d) { return x2(d.date); })
      .y0(height2)
      .y1(function(d) { return y2(d.close); });

    x.domain(d3.extent(data.map(function(d) { return d.date; })));
        y.domain([0, d3.max(data.map(function(d) { return d.close }))]);
        x2.domain(x.domain());
        y2.domain(y.domain());

    var brush = d3.svg.brush()
        .x(x2)
        .on("brush", this.brushed);

    return {
      x: x,
      x2: x2,
      y: y,
      xAxis: xAxis,
      xAxis2: xAxis2,
      yAxis: yAxis,
      area: area,
      area2: area2,
      brush: brush,
      rendered: false,
      width: width,
      height: height

    }

  },

  updateDimensions: function(){
    this.setState({width: document.getElementById('test').clientWidth - margin.left - margin.right,
                    height: 300 - margin.top - margin.bottom});
  },

  componentDidMount: function(){
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  },

  componentWillUnmount: function() {
    window.removeEventListener("resize", this.updateDimensions);
  },

  render: function(){

    var chart = "";
    if(this.props.data.length > 0){
    var data = filterDataByDate(this.props.data);
     
    var x = d3.time.scale().range([0, this.state.width]),
        x2 = d3.time.scale().range([0, this.state.width]),
        y = d3.scale.linear().range([this.state.height, 0]),
        y2 = d3.scale.linear().range([height2, 0]);

        x.domain(d3.extent(data.map(function(d) { return d.date; })));
        y.domain([0, d3.max(data.map(function(d) { return d.close }))]);
        x2.domain(x.domain());
        y2.domain(y.domain());

    var xAxis = d3.svg.axis().scale(x).orient("bottom"),
        xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
        yAxis  = d3.svg.axis().scale(y).orient("left");

    var area = d3.svg.area()
      .interpolate("monotone")
      .x(function(d) { return x(d.date); })
      .y0(this.state.height)
      .y1(function(d) { return y(d.close); });

    // var area2 = d3.svg.area()
    //     .interpolate("monotone")
    //     .x(function(d) { return x2(d.date); })
    //     .y0(height2)
    //     .y1(function(d) { return y2(d.close); });

    var brush = d3.svg.brush()
        .x(x2)
        .on("brush", this.brushed);
   
     function filterDataByDate(data){
    let months = {"Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5, "July": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11};
    let startDate = new Date(2016,6,15);
    let endDate = new Date();

    let filteredData = [];
    let obj = {date: startDate, close: 0};
    let indx = 0;
    let currentDate = startDate;

    while(currentDate < endDate && indx < data.length){
   
      let date = data[indx].created_at;
      let dateToDate = date.split(" ");
      let transformDate = new Date(dateToDate[3], months[dateToDate[2]], dateToDate[1]);

      if(transformDate > currentDate){
        if(filteredData.length > 0){
          filteredData.push(obj);

        }
        
        while(currentDate < transformDate){
          filteredData.push({date: currentDate, close: 0});
          currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));

        }
        obj = {date: currentDate, close: 1}
      } else {
        obj.close++;
      }

      indx++;
    };

    filteredData.push(obj);

    while(currentDate < endDate){
      
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
      filteredData.push({date: currentDate, close: 0});

    }

    return filteredData;
}


chart = (
<div>
        <svg width={this.state.width + margin.left + margin.right} height={this.state.height + margin.top + margin.bottom} >
          

          <g className="focus" transform={transform}>
            <path className="area" d={area(data)}></path>
            <g className="x axis">
              <Axis height={this.state.height} axis={xAxis} axisType="x"/>
            </g>
            <g className="y axis"  >
              <Axis height={this.state.height} axis={yAxis} axisType="y"/>
            </g>
          </g>

          {/*<g className="context" transform={transform2}>
            <path className="area" d={area2(data)}></path>
              <g className="x axis" >
              <Axis height={height2} axis={xAxis2} axisType="x2"/>
              </g>
              <g className="x brush">
              </g>
 </g>
            */}
             
            
    

        </svg>
             
      </div>

  );

}
    return (
    <div>
      {chart}
      </div>);
    }
});

var Axis = React.createClass({
  propTypes: {
    height:React.PropTypes.number,
    axis:React.PropTypes.func,
    axisType:React.PropTypes.oneOf(["x","x2","y"])
  },

  componentDidMount: function() { this.renderAxis(); },
  componentDidUpdate: function() { this.renderAxis(); },
  renderAxis: function() {
    var node = ReactDOM.findDOMNode(this);
    d3.select(node).call(this.props.axis);
  },
  render: function() {

    var translate;
    if(this.props.axisType=="x2"){
      translate = "translate(0,"+(this.props.height)+")";
    }  else if(this.props.axisType=="y"){
      translate = "";
    } else {
      translate = "translate(0,"+(this.props.height)+")";
    }

    return (
      <g className="axis" transform={translate}></g>
      );
  }  

});

export default LineChart;
