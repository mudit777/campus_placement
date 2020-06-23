import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import BarChart1 from '../BarCharts/BarChart1'
import PieChart from '../PieChart/PieChart'

const FilterableTable = require('react-filterable-table');

class Create extends Component{
    constructor(props){
        super(props);
        this.state = {
            BookID : "",
            Title : "",
            Author : "",
            id : root,
            value : "",
            bar_data : [],
            pie_data : {a: 10, b: 20, c:30, d:8, e:12},
            placement_status_for_charts : "placed"
        }
        
        
        this.changePie = this.changePie.bind(this);
        this.changeBar = this.changeBar.bind(this);
        this.sortTable = this.sortTable.bind(this);
    }

    componentDidMount(){
        axios.get('http://3.93.49.157:5003/piesearch/specialisation')
            .then(response => {
                if(response.status === 200){
                    this.setState({
                        pie_data : response.data
                    })

                }else{
                    console.log("Response status code is not 200, something went wrong!")
                }
            });

            axios.get('http://3.93.49.157:5003/barsearch')
            .then(response => {
                if(response.status === 200)
                {   
                    this.setState({
                        bar_data: response.data[0],
                        placement_status_for_charts: "placed"
                    })
                }else{
                    console.log("Response status code is not 200, something went wrong!")
                }
            });
    }

    changePie = (col) => {
        console.log("[IN CHANGEPIE FUNCTION] data to be sent to backend" ,col);
        axios.get('http://3.93.49.157:5003/piesearch/' + col)
            .then(response => {
                if(response.status === 200){
                    this.setState({
                        pie_data : response.data
                    })

                }else{
                    console.log("Response status code is not 200, something went wrong!")
                }
            })
            .catch(err => {
                console.error("Some error occured : \n", err)
            });
            
    }

    changeBar = (placement_status) => {
        console.log("[In change bar function] About to test an outstanding API");
        axios.get('http://3.93.49.157:5003/barsearch')
        .then(response => {
            if(response.status === 200)
            {
                if(placement_status === "placed")
                {
                    this.setState({
                        bar_data: response.data[0],
                        placement_status_for_charts: "placed"
                    })
                }
                else if(placement_status === "unplaced")
                {
                    this.setState({
                        bar_data: response.data[1],
                        placement_status_for_charts: "not placed"
                    })
                }
            }
        });
    }

    sortBarChartData() {
        var table, rows = 0
        table = document.getElementById("myTable");
        rows = table.rows;
        var updatedBarData = []
        for (let i = 1; i < (rows.length); i++) {
            var cells = rows[i].cells
            var bar_data_row = {
                "label": cells[0].innerHTML,
                "value" : parseInt(cells[2].innerHTML),
                "meaning" : cells[1].innerHTML.replace("&amp;", "&")
            }
            updatedBarData.push(bar_data_row)
            
        }
        console.log("<<<<<<<<<<<<<<< updated bar data : \n", updatedBarData)
        this.setState({
            bar_data: updatedBarData
        })
    }

    sortTable = (n, table_id) => {
        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = document.getElementById(table_id);
        switching = true;
        dir = "asc"; 
        while (switching) {
            switching = false;
            rows = table.rows;
            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = rows[i].getElementsByTagName("TD")[n];
                y = rows[i + 1].getElementsByTagName("TD")[n];
                if (dir == "asc") {
                    if(n==2) {
                        if (Number(x.innerHTML) > Number(y.innerHTML)) {
                            shouldSwitch = true;
                            break;
                          }
                    }
                    else{
                        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                            shouldSwitch= true;
                            break;
                        }
                    }
                } else if (dir == "desc") {
                    if(n==2) {
                        if (Number(x.innerHTML) < Number(y.innerHTML)) {
                            shouldSwitch = true;
                            break;
                          }
                    }
                    else{
                        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                }
            }
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                switchcount ++;      
            } else {
                if (switchcount == 0 && dir == "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }
        if(table_id == "myTable")
        {
            console.log("Calling sortBarChartData ....................")
            this.sortBarChartData()
        }
    }

    render(){
        let redirectVar = null;
        if(!localStorage.getItem("auth"))
            redirectVar = <Redirect to = "/login"/>
        console.log("$$$$$$$$$$$$$$$$$$ Printing the bar_data\n", this.state.pie_data)
        let bar_table_data = null
        if (this.state.bar_data.length > 0)
        {
            bar_table_data = this.state.bar_data.map(itr => {
                return(
                    <tr>
                        <td>{itr.label}</td>
                        <td>{itr.meaning}</td>
                        <td>{itr.value}</td>
                    </tr>
                )
            })
        }
        let pie_table_data = null
        if (Object.keys(this.state.pie_data).length > 0)
        {
            pie_table_data = Object.entries(this.state.pie_data).map(([field, count]) => {
                return (
                    <tr>
                        <td>{field}</td>
                        <td>{count}</td>
                    </tr>
                )
            })
        }
        return( 
            <div>
                {redirectVar}
                <br></br>
        
                <div class="bar-chart">
                    <div class = "left-container">
                    <li class="dropdown dropdown-items">
                            <a href="#" class="dropdown-toggle mainlinks" data-toggle="dropdown"> Placement <span class="caret"></span></a>
                            <ul class="dropdown-menu dropdown-menu-right mymenu">
                                <li class="listitems"><a class="dropdown-item menulinks"  href="#" onClick = {() => {this.changeBar("placed")}} role="menu">Placed</a></li>
                                <li class="listitems"><a class="dropdown-item menulinks" href="#" onClick = {() => {this.changeBar("unplaced")}} role="menu">Not Placed</a></li>
                            </ul>
                        </li>
                        <BarChart1 data={this.state.bar_data} placement_status={this.state.placement_status_for_charts}/>
                    </div>
                    <div class = "right-container">
                        <br></br>
                        <table id="myTable">
                            <tr>
                                <th onClick = {() => {this.sortTable(0, "myTable")}}>Label &#9662;</th>
                                <th onClick = {() => {this.sortTable(1, "myTable")}}>Categories &#9662;</th>
                                <th onClick = {() => {this.sortTable(2, "myTable")}}>Value &#9662;</th>
                            </tr>
                            {bar_table_data}
                        </table>
                    </div>
                </div>
                
                <br></br><br></br>

                <div class="pie-chart">
                    <div class = "left-pie-container">
                        <li class="dropdown dropdown-items">
                            <a href="#" class="dropdown-toggle mainlinks" data-toggle="dropdown"> Filter <span class="caret"></span></a>
                            <ul class="dropdown-menu dropdown-menu-right mymenu">
                                <li class="listitems"><a id="gender" class="dropdown-item menulinks" href="#" onClick = {() => {this.changePie("gender")}} role="menu">Gender</a></li>
                                <li class="listitems"><a class="dropdown-item menulinks" href="#" onClick = {() => {this.changePie("ssc_b")}} role="menu">SSC Board</a></li>
                                <li class="listitems"><a class="dropdown-item menulinks" href="#" onClick = {() => {this.changePie("hsc_b")}} role="menu">HSC Board</a></li>
                                <li class="listitems"><a class="dropdown-item menulinks" href="#" onClick = {() => {this.changePie("hsc_s")}} role="menu">HSC Stream</a></li>
                                <li class="listitems"><a class="dropdown-item menulinks" href="#" onClick = {() => {this.changePie("degree_t")}} role="menu">Degree Field</a></li>
                                <li class="listitems"><a class="dropdown-item menulinks" href="#" onClick = {() => {this.changePie("specialisation")}}role="menu">MBA Specialisation</a></li>
                                <li class="listitems"><a class="dropdown-item menulinks" href="#" onClick = {() => {this.changePie("status")}} role="menu">Placed/Unplaced</a></li>
                            </ul>
                        </li>
                        <PieChart data={this.state.pie_data}/>
                    </div>
                    <div class = "right-container">
                        <br></br>
                        <table id="myTable1">
                            <tr>
                                <th onClick = {() => {this.sortTable(0, "myTable1")}}>Feild &#9662;</th>
                                <th onClick = {() => {this.sortTable(1, "myTable1")}}>Count &#9662;</th>
                            </tr>
                            {pie_table_data}
                        </table>
                    </div>
                </div>

            </div>
        )
    }
}

export default Create;