import React, {Component} from 'react';
import * as d3 from "d3";

class PieChart extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            data: props.data
        }
    }
    
    componentWillReceiveProps(props) {
            this.setState({ 
                data: props.data 
            }); 
        this.drawChart(props.data)
    }

      
    drawChart(piedata) {
        var width = 450
        var height = 450
        var margin = 60
        var radius = Math.min(width, height) / 2 - margin
        d3.select(".myclass").remove();
        var svg = d3.select("#container1")
            .append("div")
            .classed("myclass", true)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        var data = piedata
        var total = 215
        var color = d3.scaleOrdinal()
            .domain(data)
            .range(["#24D9FA", "#FA5B60", "#6E5BFA"])
        var pie = d3.pie()
            .value(function(d) {return d.value; })

        var data_ready = pie(d3.entries(data))
        var arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
        svg.selectAll('mySlices')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', arcGenerator)
            .attr('fill', function(d){ return(color(d.data.key)) })
            .attr("stroke", "black")
            .style("stroke-width", "1px")
            .style("opacity", 0.9)
        svg.selectAll('mySlices')
            .data(data_ready)
            .enter()
            .append('text')
                .attr("dy", "0em")
                .text(function(d){ return "" + d.data.key +  " (" + Math.round(d.data.value / total * 100) + "%)"})
                .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
                .style("text-anchor", "middle")
                .style("font-size", 10)

        svg.append('text')
            .attr('class', 'title')
            .attr('x', margin - 40)
            .attr('y', -200)
            .attr('text-anchor', 'middle')
            .text('Distribution of data')    
    }

    render(){
        return <div id='container1' style={{marginLeft: 80}}>
        </div>
      }

}

export default PieChart;