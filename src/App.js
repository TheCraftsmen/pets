/* eslint-disable */
import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Login from './Login';
import Main from './Main';
import './App.css';
import * as firebase from 'firebase';
import axios from 'axios';

// your firebase credentials config 
var config = {
};
firebase.initializeApp(config);

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

var encodeQueryData = function(data) {
  var ret = [];
  for (var d in data)
    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  return ret.join('&');
}


class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      login: false, 
      open: false, 
      pictures: null,
      email: '',
      password: '',
      response: '',
      filename: '',
      country: '',
      countrystate: '',
      contact: '',
      description: '',
      city: null,
      countries: [],
      countrystates: [],
      token: null,
      openSnackbar: false
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onFileLoad = this.onFileLoad.bind(this);
    this.signUp = this.signUp.bind(this);
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
    this.setEmailState = this.setEmailState.bind(this);
    this.setPassState = this.setPassState.bind(this);
    this.handleNewPost = this.handleNewPost.bind(this);
    this.setNameState = this.setNameState.bind(this);
    this.setBreedState = this.setBreedState.bind(this);
    this.setDesState = this.setDesState.bind(this);
    this.setCountry = this.setCountry.bind(this);
    this.setCountryState = this.setCountryState.bind(this);
    this.setCity = this.setCity.bind(this);
    this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
    this.setContactState = this.setContactState.bind(this);
    this.facebookLogin = this.facebookLogin.bind(this);
    this.googleLogin = this.googleLogin.bind(this);
  };

  componentDidMount(){
    var self = this;
    var user = firebase.auth().currentUser;
    if (user) {
      self.setState({login: true});
    }
    axios.get('https://api.mercadolibre.com/countries?attributes=id,name').then((resp) => {
      return resp.data;
    }).then((response) => {
      this.setState({countries: response});
    });

  }

  handleLogin(){
    this.setState({login: true}); 
  };

  handleOpen() {
    this.setState({open: true});
  };

  handleClose(e) {
    this.setState({open: false});
  };

  handleCloseSnackbar(){
    this.setState({openSnackbar: false});
  };

  onFileLoad(e, file){
    this.setState({pictures: file, filename: file.name});
  };

  setEmailState(email){
    this.setState({email:email});
  };

  setPassState(password){
    this.setState({password:password});
  };

  setNameState(name){
    this.setState({name: name});
  };

  setBreedState(breed){
    this.setState({breed: breed});
  };

  setDesState(description){
    this.setState({description: description});
  };

  setContactState(contact){
    this.setState({contact: contact});
  };

  setCountry(event, index, value) {
    this.setState({country: value, countrystate: null, city: null});
  };

  setCountryState = (event, index, value) => {
    this.setState({countrystate: value, city: null})
  };

  setCity = (event, index, value) => {
    this.setState({city: value});
  };

  handleNewPost(){
    var storageRef = firebase.storage().ref();
    storageRef.child('images/' + this.state.filename).put(this.state.pictures)
    .then((snapshot) => {
      var image = snapshot.downloadURL;
      var url = 'https://api.sightengine.com/1.0/check.json';
      // sightengine credentials
      var apiUser = '<apiUser>';
      var apiSecret ='<apiSecret>';
      var media = this.state.pictures;
      var data = { 'models': ['nudity','wad', 'face-attributes'].join(), 'url': image, 'api_user': apiUser, 'api_secret': apiSecret };
      var querystring = encodeQueryData(data);
      axios.get(url + '?' + querystring).then((response) => {
        var data = response.data;
        var not_alcohol = 0.1 > data.alcohol;
        var not_drugs = 0.1 > data.drugs;
        var not_weapon = 0.1 > data.weapon;
        var not_nudity = data.nudity.safe > 0.9
        var not_faces = data.faces ? !data.faces.length : false
        if(not_alcohol && not_drugs && not_weapon && not_nudity && not_faces){
          var userId = firebase.auth().currentUser.uid;
          var petsId = guid();
          firebase.database().ref('pets/' + petsId).set({
            filename: 'images/' + this.state.filename,
            name: this.state.name,
            breed : this.state.breed,
            description: this.state.description,
            country: this.state.country,
            countrystate: this.state.countrystate,
            city: this.state.city,
            user: userId,
            closed: false,
            contact: this.state.contact
          }).then((e) =>{
            this.setState({open: false, openSnackbar: true, response: "Publicación realizada con éxito."});
          });
        }
        else {
          this.setState({
            openSnackbar: true,
            response: 'Imagen no valida para el sitio.'
          });
        }
      }).catch((error) => {
        this.setState({
          openSnackbar: true,
          response: error.toString()
        });
      });
    });
  };

  async signUp(){
    try{
      await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password);
      this.setState({
        openSnackbar: true,
        response: 'Usuario creado con éxito.'
      });
    }catch(error){
      this.setState({
        openSnackbar: true,
        response: error.toString()
      });
    }
  };

  login(){
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((response) => {
          firebase.auth().currentUser.getIdToken().then((token) => {
            this.setState({
              token: token,
              login: true
            });
          });
      }).catch((error) => {
          this.setState({
            openSnackbar: true,
            response: error.message
          });
      });
  }

  logout(){
      firebase.auth().signOut().then((response) => {
          this.setState({
            openSnackbar: true,
            response: 'Sesión finalizada',
            login: false
          })
      }).catch((error) => {
          this.setState({
            openSnackbar: true,
            response: "Error al cerrar sesión"
          })  
      });
  }

  async facebookLogin(){
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.setCustomParameters({
      'display': 'popup'
    });
    firebase.auth().signInWithPopup(provider).then((result) => {
      var token = result.credential.accessToken;
      this.setState({
          token: token,
          login: true
      });
    }).catch((error) => {
      this.setState({
        openSnackbar: true,
        response: error.message
      })
    });
  }

  async googleLogin(){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
      var token = result.credential.accessToken;
      this.setState({
          token: token,
          login: true
      });
    }).catch((error) => {
      this.setState({
        openSnackbar: true,
        response: error.message
      })
    });
  }

  render() {
    return (
      <MuiThemeProvider >
        {this.state.login ? 
          <Main 
            handleOpen={this.handleOpen}
            handleClose={this.handleClose}
            handleNewPost={this.handleNewPost}
            open={this.state.open}
            onFileLoad={this.onFileLoad}
            onChangePicture={this.onChangePicture}
            pictures={this.state.pictures}
            setNameState={this.setNameState}
            setBreedState={this.setBreedState}
            setDesState={this.setDesState}
            setCountry={this.setCountry}
            setCountryState={this.setCountryState}
            setCity={this.setCity}
            countries={this.state.countries}
            country={this.state.country}
            countrystate={this.state.countrystate}
            countrystates={this.state.countrystates}
            city={this.state.city}
            firebase={firebase}
            token={this.state.token}
            logout={this.logout}
            openSnackbar={this.state.openSnackbar}
            handleCloseSnackbar={this.handleCloseSnackbar}
            snackBarResponse={this.state.response}
            setContactState={this.setContactState}
          />: 
          <Login 
            handleLogin={this.login}
            handlesignup={this.signUp}
            setEmailState={this.setEmailState}
            setPassState={this.setPassState}
            facebookLogin={this.facebookLogin}
            googleLogin={this.googleLogin}
            openSnackbar={this.state.openSnackbar}
            handleCloseSnackbar={this.handleCloseSnackbar}
            snackBarResponse={this.state.response}
          />}
      </MuiThemeProvider>
      
    );
  }
}

export default App;
