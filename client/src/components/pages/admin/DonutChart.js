import React from 'react';
import {render} from 'react-dom';
import ReactDOM from 'react-dom';
import ReactNativeSlider from "react-html5-slider";
import ReactFauxDOM from 'react-faux-dom';

var DonutChart=React.createClass({

  componentDidMount: function(){
      var width = document.getElementById('donutchart').clientWidth,
          height =  200,
          radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.population; });

var svg = d3.select("#donutchart").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var data = [
    {age: '<5', population: 2704659},
    {age: '5-13', population: 4499890},
    {age: '14-17', population: 2159981},
    {age: '18-24', population: 3853788}

  ];  
run(data);
function run(data) {

  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.age); });

  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.age; });
};

function type(d) {
  d.population = +d.population;
  return d;
}

  },

    render:function(){
        

        return (
            <div>
                
            
            </div>
        );
    }
});

export default DonutChart;
