import React, {Component} from 'react';
import * as d3 from "d3";
import { max } from 'd3';

class BarChart1 extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            data: props.data,
            placement_status: props.placement_status
        }
    }

    componentWillReceiveProps(props) {
        console.log("Inside componentWillReceiveProps of BarChart .................", props.data)
            this.setState({ 
                data: props.data,
                placement_status: props.placement_status
            }); 

        this.drawChart(props.data, props.placement_status)
    }
      
    drawChart(bardata, placement_status) {

      const sample = bardata
      
      const svg = d3.select('svg')

      const svgContainer = d3.select('#container');
      
      const margin = 80;
      const width = 900 - 4.5 * margin;
      const height = 700 - 4.5 * margin;
  
      svg.select(".chartclass").remove();

      const chart = svg.append('g')
        .attr("class", "chartclass")
        .attr('transform', `translate(${margin}, ${margin})`);
  
      const xScale = d3.scaleBand()
        .range([0, width])
        .domain(sample.map((s) => s.label))
        .padding(0.35)

      var all_values = []
      sample.map((s) => {
          all_values.push(s.value)
      })
      console.log("max_data_value : ", max(all_values))
      
      const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, max(all_values) + 10]);

      chart.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));
  
      chart.append('g')
        .call(d3.axisLeft(yScale));
        
      const barGroups = chart.selectAll()
            .data(sample)
            .enter()
            .append('g')
  
      barGroups.append('rect')
        .attr('class', 'bar')
        .attr('x', (g) => xScale(g.label))
        .attr('y', (g) => yScale(g.value))
        .attr('height', (g) => height - yScale(g.value))
        .attr('width', xScale.bandwidth())
        .attr("fill", "#4C58D3")
        .on('mouseenter', function (actual, i) {
          d3.selectAll('.value')
            .attr('opacity', 0)
  
          d3.select(this)
            .transition()
            .duration(300)
            .attr('opacity', 0.6)
            .attr('x', (a) => xScale(a.label) - 5)
            .attr('width', xScale.bandwidth() + 10)
  
          const y = yScale(actual.value)
  
          var line = chart.append('line')
            .attr('id', 'limit')
            .attr('x1', 0)
            .attr('y1', y)
            .attr('x2', width)
            .attr('y2', y)
  
          barGroups.append('text')
            .attr('class', 'divergence')
            .attr('x', (a) => xScale(a.label) + xScale.bandwidth() / 2)
            .attr('y', (a) => yScale(a.value) - 5)
            .attr('fill', 'blue')
            .attr('text-anchor', 'middle')
            .text((a, idx) => {
              const divergence = (a.value - actual.value).toFixed(1)
              
              let text = ''
              if (divergence > 0) text += '+'
              text += `${divergence}%`
  
              return idx !== i ? text : '';
            })
  
        })
        .on('mouseleave', function () {
          d3.selectAll('.value')
            .attr('opacity', 1)
  
          d3.select(this)
            .transition()
            .duration(300)
            .attr('opacity', 1)
            .attr('x', (a) => xScale(a.label))
            .attr('width', xScale.bandwidth())
  
          chart.selectAll('#limit').remove()
          chart.selectAll('.divergence').remove()
        })
  
      barGroups 
        .append('text')
        .attr('class', 'value')
        .attr('x', (a) => xScale(a.label) + xScale.bandwidth() / 2)
        .attr('y', (a) => yScale(a.value) - 5)
        .attr('text-anchor', 'middle')
        .attr('fill', 'blue')
        .text((a) => `${a.value}`)
      
      svg.append('text')
        .attr('class', 'label')
        .attr('x', -(height / 2) - margin)
        .attr('y', margin / 1.5)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Value')
  
      svg.append('text')
        .attr('class', 'label')
        .attr('x', width / 2 + margin)
        .attr('y', height + margin * 1.5)
        .attr('text-anchor', 'middle')
        .text('Categories')
  
      svg.select(".title").remove();

      svg.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + margin)
        .attr('y', 70)
        .attr('text-anchor', 'middle')
        .text('Categorical distribution where status is "' + placement_status + '"')
    }

    render(){
        return <div id='container'><svg height='500px' width='700px' /></div>
      }

}

export default BarChart1;