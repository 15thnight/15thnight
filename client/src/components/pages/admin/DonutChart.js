import React from 'react';
import {render} from 'react-dom';
import ReactDOM from 'react-dom';
import ReactNativeSlider from "react-html5-slider";
import ReactFauxDOM from 'react-faux-dom';

function createChart(dom, props){
  var width = props.width;
  var height = props.height;
  var width = width + 20;
  var data = props.data;
  var sum = data.reduce(function(memo, num){
        return memo + num.count; 
      }, 0);

  var chart = d3.select(dom)
    .append('svg')
    .attr('class', 'd3').attr('width', width).attr('height', height)
    .append('g')
    .attr("transform", "translate(" + (props.width/2) + "," + (height/2) + ")");

  var outerRadius = props.width/2.2;
  var innerRadius = props.width/8;
  var arc = d3.svg.arc()
    .outerRadius(outerRadius)
    .innerRadius(innerRadius);

  var colors =  ['#FD9827', '#DA3B21', '#3669C9', '#1D9524', '#971497'];
  var pie = d3.layout.pie()
    .value(function(d) { return d.count; });

  var g = chart.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "arc")
    .on("click", function(d) {
      alert('you clicked ' + d.data.name)
    })
    .on('mouseover', function(d, i) {
      d3.select(this)
        .transition()
        .duration(500)
        .ease('bounce')
        .attr("transform", function(d) {
          var dist = 10;
          d.midAngle = ((d.endAngle - d.startAngle)/ 2) + d.startAngle;
          var x = Math.sin(d.midAngle) * dist;
          var y = -Math.cos(d.midAngle) * dist;
          return 'translate(' + x + ',' + y + ')';
        });
      d3.select(this).append("text").style("fill", function(d) { return colors[i]; }).attr("id", "percent")
          .attr('transform', "translate(0,-5)")
          .attr("text-anchor", "middle").attr("dy", ".35em").style("font", "bold 15px Arial")
          .text(function(d) { return (((d.value/sum)*100).toFixed(1) + " %"); 
        });
          g.filter(function(e) { return e.value != d.value; }).style('opacity',0.5);
        }).on('mouseout', function (d, i) {
            d3.select(this)
            .transition()
            .duration(500)
            .ease('bounce')
            .attr('transform', 'translate(0,0)');
            d3.select("#percent").remove();
            g.filter(function(e) { return e.value != d.value; }).style('opacity',1)
          });

    g.append("path")
    .style("fill", function(d, i) { return colors[i]; })
    .transition().delay(function(d, i) { return i * 400; }).duration(500)
    .attrTween('d', function(d) {
         var i = d3.interpolate(d.startAngle, d.endAngle);
         return function(t) {
             d.endAngle = i(t);
           return arc(d);
         }
    });

    var center = 
  g.filter(function(d) { return d.endAngle - d.startAngle > .1; }).append("text").style("fill", "white")
    .attr('transform', function(d){
      return "translate(" + arc.centroid(d) + ")";
    })
    .attr("text-anchor", "middle").attr("dy", ".35em")
    .text(function(d) { return d.value; });

};

var PieChart = React.createClass({
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    data: React.PropTypes.array.isRequired,
  },

  getDefaultProps: function() {
    return {
      width: 200,
      height: 200,
      
    };
  },

  getDefaultState: function(){
    return {
      render: false
    }
  },

  render: function() {

    return (
      <div>
      </div>
    );
  },

  componentDidMount: function() {
    if(this.props.data !== undefined){
      var dom = ReactDOM.findDOMNode(this);
      createChart(dom, this.props);
    }
  },

  shouldComponentUpdate: function() {
      if(this.props.data !== undefined){
        var dom = ReactDOM.findDOMNode(this);
        createChart(dom, this.props);
      }
      return false;
  }
});

export default PieChart; 