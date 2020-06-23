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
        // console.log("Inside componentWillReceiveProps .................", props.data)
        // setTimeout(() => {
            this.setState({ 
                data: props.data 
            }); 
        // }, 200);
        this.drawChart(props.data)
    }

    // componentDidMount() {
    //   this.drawChart();
    // }
      
    drawChart(piedata) {
        var width = 450
        var height = 450
        var margin = 60

        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        var radius = Math.min(width, height) / 2 - margin

        // append the svg object to the div called 'my_dataviz'

        // const svg = d3.select('svg');
        // const svgContainer = d3.select('#container1');

        d3.select(".myclass").remove();

        var svg = d3.select("#container1")
            .append("div")
            .classed("myclass", true)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // Create dummy data

        var data = piedata
        // console.log("___________________ Here in PieChart, data is : ", data)
        var total = 215

        // set the color scale
        // var color = d3.scaleOrdinal()
        //     .domain(data)
        //     .range(d3.schemeSet2);

        var color = d3.scaleOrdinal()
            .domain(data)
            .range(["#24D9FA", "#FA5B60", "#6E5BFA"])

        // Compute the position of each group on the pie:
        var pie = d3.pie()
            .value(function(d) {return d.value; })

        var data_ready = pie(d3.entries(data))
        // Now I know that group A goes from 0 degrees to x degrees and so on.

        // shape helper to build arcs:
        var arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(radius)

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg.selectAll('mySlices')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', arcGenerator)
            .attr('fill', function(d){ return(color(d.data.key)) })
            .attr("stroke", "black")
            .style("stroke-width", "1px")
            .style("opacity", 0.9)

        // Now add the annotation. Use the centroid method to get the best coordinates
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

            // return "<tspan x='0' dy='1.2em'>" + d.data.key + "</tspan>" + "<tspan x='0' dy='1.2em'>" +" (" + Math.round(d.data.value / total * 100) + "%)" + "</tspan>";
    
    }

    render(){
        return <div id='container1' style={{marginLeft: 80}}>
        </div>
      }

}

export default PieChart;