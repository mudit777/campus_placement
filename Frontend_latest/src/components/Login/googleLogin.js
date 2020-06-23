import React, { Component } from "react"
import "./google_login.css"
import firebase from "firebase"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import {Redirect} from 'react-router';
import cookie from 'react-cookies';

firebase.initializeApp({
  apiKey: "AIzaSyB3Bx05r1AlNiLZwDryzWrUwmUoJ-dHVGE",
  authDomain: "ampusplacement.firebaseapp.com"
})

class googleLogin extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: "",
      authFlag: false, 
      isSignedIn: false
    }
  }

  // state = { 
  //   isSignedIn: false 
  // }
  uiConfig = 
  {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccess: () => false
    }
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ 
        isSignedIn: !!user 
      })
      console.log("~~~~~~~~~~~User", user)
      if(user!=undefined && user!=null)
      {
        localStorage.setItem("auth", true)
      }
    })
  }

  render() {
    let redirectVar = null
    if(this.state.isSignedIn)
      // if(localStorage.getItem("auth"))
        redirectVar = <Redirect to= "/dashboard"/>
    return (
      <div className="myApp">
        {redirectVar}
        {this.state.isSignedIn ? (
          <span>
            <div>Signed In!</div>
            <button onClick={() => firebase.auth().signOut()}>Sign out!</button>
            <h1>Welcome {firebase.auth().currentUser.displayName}</h1>
            <img
              alt="profile picture"
              src={firebase.auth().currentUser.photoURL}
            />
          </span>
        ) : (
          <StyledFirebaseAuth
            uiConfig={this.uiConfig}
            firebaseAuth={firebase.auth()}
          />
        )}
      </div>
    )
  }
}



export default googleLogin