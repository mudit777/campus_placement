import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import firebase from "firebase"


class Navbar extends Component {
    constructor(props){
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }
    handleLogout = () => {
        console.log(".............. Removing localStorage")
        localStorage.clear()
        firebase.auth().signOut()
    }
    render(){
        let navLogin = null;
        if(localStorage.getItem("auth")){
            console.log("Able to read cookie");
            navLogin = (
                <ul class="nav navbar-nav navbar-right">
                        <li><Link to="/login" onClick = {this.handleLogout}><span class="glyphicon glyphicon-user"></span>Logout</Link></li>
                </ul>
            );
        }
        else{
            console.log("Not Able to read cookie");
            navLogin = (
                <ul class="nav navbar-nav navbar-right">
                        <li><Link to="/login"><span class="glyphicon glyphicon-log-in"></span> Login</Link></li>
                </ul>
            )
        }

        let logoutmessage = null;
        if(!localStorage.getItem("auth")){
            logoutmessage = (
                <p><center>You are currently logged out !!!!</center></p>
            );
        }

        let redirectVar = null;
        if(localStorage.getItem("auth")){
            redirectVar = <Redirect to="/dashboard"/>
        }
        return(
            <div>
                {redirectVar}
            <nav class="navbar navbar-inverse">
                <div class="container-fluid">
                    <div class="navbar-header">
                        <a class="navbar-brand" href="#">My App</a>
                    </div>
                    <ul class="nav navbar-nav">
                        <li class="active"><Link to="/dashboard">Home</Link></li>
                        <li><Link to="/dashboard">Dashboards</Link></li>
                    </ul>
                    {navLogin}
                </div>
            </nav>
            {logoutmessage}
        </div>
        )
    }
}

export default Navbar;