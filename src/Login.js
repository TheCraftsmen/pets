import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {Tabs, Tab} from 'material-ui/Tabs';
import Snackbar from 'material-ui/Snackbar';
import './App.css';


export default class Login extends Component{

    render(){
        return(
            <div>
              <div className="container-login">
              <h1 className="super-font big" >puppianos.com</h1>
              <h2 className="super-font">Adopción responsable</h2>
              <Tabs >
              <Tab label="Ingresar" >
                <div>
                  <TextField
                    hintText="Email"
                    floatingLabelText="Email"
                    type="email"
                    onChange={(e) => this.props.setEmailState(e.target.value)}
                    fullWidth={true}
                  />
                  <br />
                  <TextField
                    hintText="Contraseña"
                    floatingLabelText="Contraseña"
                    type="password"
                    onChange={(e) => this.props.setPassState(e.target.value)}
                    fullWidth={true}
                  />
                  <br />
                  <RaisedButton 
                    label="Ingresar"  
                    fullWidth={true}
                    onTouchTap={ () => this.props.handleLogin()}/>
                  <br />
                  <br />
                  <RaisedButton 
                    backgroundColor="#3b5998"
                    labelColor="#ffffff"
                    label="Ingresar con Facebook" 
                    fullWidth={true}
                    onTouchTap={ () => this.props.facebookLogin()}/>
                  <br />
                  <br />
                  <RaisedButton 
                    backgroundColor="#F44336"
                    labelColor="#ffffff"
                    label="Ingresar con Google" 
                    fullWidth={true}
                    onTouchTap={ () => this.props.googleLogin()}/>
                </div>
              </Tab>
              <Tab label="Registrarse" >
                <div>
                  <TextField
                    hintText="Email"
                    floatingLabelText="Email"
                    onChange={(e) => this.props.setEmailState(e.target.value)}
                    type="email"
                    fullWidth={true}
                  />
                  <br />
                  <TextField
                    hintText="Contraseña"
                    floatingLabelText="Contraseña"
                    onChange={(e) => this.props.setPassState(e.target.value)}
                    type="password"
                    fullWidth={true}
                  />
                  <br />
                  <RaisedButton 
                    label="Aceptar" 
                    fullWidth={true}
                    onTouchTap={ () => this.props.handlesignup()}/>
                </div>
              </Tab>
            </Tabs>  
            </div>
              <Snackbar
              open={this.props.openSnackbar}
              message={this.props.snackBarResponse}
              autoHideDuration={4000}
              onRequestClose={this.props.handleCloseSnackbar}
            />
            </div>

        )
    }
}