import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './Login/Login';
import Home from './Home/Home';
import Dashboard from './Dashboard/Dashboard';
import Navbar from './LandingPage/Navbar';
import googleLogin from './Login/googleLogin';
class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Route path="/" component={Navbar}/>
                <Route path="/login" component={googleLogin}/>
                <Route path="/home" component={Home}/>
                <Route path="/dashboard" component={Dashboard}/>
            </div>
        )
    }
}
//Export The Main Component
export default Main;