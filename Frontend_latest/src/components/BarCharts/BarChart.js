import React, {Component} from 'react';
import * as d3 from "d3";

class BarChart extends Component {
    
    
    componentDidMount() {
      this.drawChart();
    }
      
    drawChart() {
      const data = this.props.data

      const x_labels = ["label1", "label2", "label3", "label4", "label5"]

      var x_domain = d3.extent(x_labels)

      var xAxis = d3.axisBottom()
      
      const svg = d3.select("body")
        .append("svg")
        .attr("width", this.props.width)
        .attr("height", this.props.height)
        .style("margin-left", 100);
                    
      svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * 70)
            .attr("y", (d, i) => this.props.height - 15 * d)
            .attr("width", 30)
            .attr("height", (d, i) => d * 15)
            .attr("fill", "blue")

      svg.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .text((d) => d)
            .attr("x", (d, i) => i * 70)
            .attr("y", (d, i) => this.props.height - (15 * d) - 3)

      //Add the X-axis
      const xScale = d3.scaleBand()
            .range([0, this.props.width])
            .domain(x_labels)
            .padding(0.2)

//       var x_axis = d3.axisBottom()
//                    .scale(scale);

      svg.append('g')
            .attr('transform', `translate(0, this.props.height)`)
            .call(d3.axisBottom(xScale));

      svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", 205)
            .attr("y", 250)
            .text("income per capita");
    }
          
    render(){
      return <div id={"#" + this.props.id}></div>
    }
  }
      
  export default BarChart;