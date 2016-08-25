import React from 'react';
import {render} from 'react-dom';
import ReactDOM from 'react-dom';
import ReactNativeSlider from "react-html5-slider";
import ReactFauxDOM from 'react-faux-dom';

var LineChart=React.createClass({

    render:function(){
        var margin = {top: 0, right: 10, bottom: 110, left: 40},
    margin2 = {top: 320, right: 10, bottom: 40, left: 40},
    width = 600 - margin.left - margin.right,
    height = 380 - margin.top - margin.bottom,
    height2 = 400 - margin2.top - margin2.bottom;
    
var formatDate = d3.time.format("%d-%b-%y");

var parseDate = d3.time.format("%d-%b-%y").parse,
    bisectDate = d3.bisector(function(d) { return d.date; }).left,
    formatValue = d3.format(",.2f"),
    formatCurrency = function(d) { return "$" + formatValue(d); };

var x = d3.time.scale().range([0, width]),
    x2 = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    y2 = d3.scale.linear().range([height2, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");

var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);

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

var node = ReactFauxDOM.createElement('div')

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

var data=[ //this is test data
            {date:'02-11-2016',close:180},
            {date:'02-12-2016',close:250},
            {date:'02-13-2016',close:150},
            {date:'02-14-2016',close:496},
            {date:'02-15-2016',close:140},
            {date:'02-16-2016',close:380},
            {date:'02-17-2016',close:100},
            {date:'02-18-2016',close:150}
        ];
var parseDate = d3.time.format("%m-%d-%Y").parse;
data.forEach(function (d, i) {
            d.date = parseDate(d.date);
        });

test(data);

function test(data) {
    x.domain(d3.extent(data.map(function(d) { return d.date; })));
    y.domain([0, d3.max(data.map(function(d) { return d.close; }))]);
    x2.domain(x.domain());
    y2.domain(y.domain());

    focus.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area);

    focus.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    focus.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    context.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area2);

    context.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

    context.append("g")
      .attr("class", "x brush")
      .call(brush)
    .selectAll("rect")
      .attr("y", -6)
      .attr("height", height2 + 7);

}

function brushed() {
  x.domain(brush.empty() ? x2.domain() : brush.extent());
  focus.select(".area").attr("d", area);
  focus.select(".x.axis").call(xAxis);
}

function type(d) {
  d.date = formatDate.parse(d.date);
  d.close = +d.close;
  return d;
}

        return (
            <div className="chart" id="test">
                
            
            </div>
        );
    }
});

export default LineChart;
