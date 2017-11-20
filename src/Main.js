/* eslint-disable */
import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import SearchBar from './SearchBar'
import PetCard from './PetCard'
import NewPost from './NewPost'
import CircularProgress from 'material-ui/CircularProgress';
import Snackbar from 'material-ui/Snackbar';
import {List, ListItem} from 'material-ui/List';
import Cancel from 'material-ui/svg-icons/content/clear';
import Subheader from 'material-ui/Subheader';
import AppDrawer from './AppDrawer';
import axios from 'axios';
import './App.css';

export const snapshotToArray = function(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;
        if(!item.closed)
          returnArr.push(item);
    });

    return returnArr;
};

export default class Main extends Component{

    constructor(props){
        super(props);
        this.state = { pets: [],
                       searchcountry: null,
                       searchstate: null,
                       searchcity: null,
                       pivot: 0,
                       openDrawer: false,
                       mypets: false,
                       mypetslist: null,
                       closepostsnackbar: false,
                       empty: false
        };
        this.handleSearchCountry = this.handleSearchCountry.bind(this);
        this.handleSearchState = this.handleSearchState.bind(this);
        this.handleSearchCity = this.handleSearchCity.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.movePivotRight = this.movePivotRight.bind(this);
        this.movePivotLeft = this.movePivotLeft.bind(this);
        this.handleCloseDrawer = this.handleCloseDrawer.bind(this);
        this.handleOpenDrawer = this.handleOpenDrawer.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.mypetsChangeTrue = this.mypetsChangeTrue.bind(this);
        this.mypetsChangeFalse = this.mypetsChangeFalse.bind(this);
        this.closePost = this.closePost.bind(this);
        this.handleClosePostSnackBar = this.handleClosePostSnackBar.bind(this);
    }

    componentDidMount(){
        
        /*
        var token = 'Bearer ' + this.props.token;
        axios.get('https://us-central1-kairopy-25101.cloudfunctions.net/api/pets',
          { headers: { Authorization: token } })
        .then((resp) => {
            this.setState({ pets: resp.data });
        })
        .catch((error) => {
            console.log('error ' + error);
        });
        */
        var childvalue = null;
        var filter = null;
        if (this.state.searchcountry){
          childvalue = "country";
          filter = this.state.searchcountry    
        } else if (this.state.searchstate) {
          childvalue = "countrystate";
          filter = this.state.searchstate  
        } else {
          childvalue = "city";
          filter = this.state.searchcity;   
        }
        if (childvalue && filter){
          var reference = this.props.firebase.database().ref('pets')
          reference.orderByChild(childvalue)
          .equalTo(filter)
          .on("value", (snapshot) => {
            var pets = snapshotToArray(snapshot)
            if (pets.length == 0)
              this.setState({pets: pets, empty: true});
            else
              this.setState({pets: pets});
          });  
        } else{
          var reference = this.props.firebase.database().ref('pets').limitToLast(100);
          reference.on("value", (snapshot) => {
            var pets = snapshotToArray(snapshot)
            if (pets.length == 0)
              this.setState({pets: pets, empty: true});
            else
              this.setState({pets: pets});
          }); 
        }
        

        var reference = this.props.firebase.database().ref('/pets')
        reference.orderByChild("user")
        .equalTo(this.props.firebase.auth().currentUser.uid)
        .on("value", (snapshot) => {
          var mypetslist = snapshotToArray(snapshot)
          this.setState({mypetslist: mypetslist})
        });
    }

    componentWillUpdate(nextProps, nextState){
        nextState.searchcountry
        var childvalue = null;
        var filter = null;
        if (nextState.searchcountry && (nextState.searchcountry !== this.state.searchcountry)){
          childvalue = "country";
          filter = nextState.searchcountry   
        } else if (nextState.searchstate && (nextState.searchstate !== this.state.searchstate)) {
          childvalue = "countrystate";
          filter = nextState.searchstate  
        } else if (nextState.searchcity && (nextState.searchcity !== this.state.searchcity)) {
          childvalue = "city";
          filter = nextState.searchcity;   
        }
        if (childvalue && filter){
          var reference = this.props.firebase.database().ref('pets')
          reference.orderByChild(childvalue)
          .equalTo(filter)
          .on("value", (snapshot) => {
            var pets = snapshotToArray(snapshot)
            this.setState({pets: pets, pivot: 0})
          });  
        }
    }

    movePivotLeft(){
      if (this.state.pivot - 1 < 0){
          this.setState({pivot: 0});
      } else {
          this.setState({pivot: this.state.pivot - 1 });
      }
    }

    movePivotRight(){
      if (this.state.pivot + 1 >= this.state.pets.length ){
          this.setState({pivot: this.state.pets.length - 1});
      } else {
          this.setState({pivot: this.state.pivot + 1 });
      }
    }

    mypetsChangeTrue(){
        this.setState({mypets: true, openDrawer: false});
    }

    mypetsChangeFalse(){
        this.setState({mypets: false, openDrawer: false});
    }

    handleSearchCountry = (event, index, value) => {
        this.setState({searchcountry: value, searchstate: null, searchcity: null});
    }

    handleSearchState = (event, index, value) => {
        this.setState({searchstate: value, searchcity: null}); 
    }

    handleSearchCity = (event, index, value) => {
        this.setState({searchcity: value});
    }

    handleChange = (event, index, value) => {
        this.props.setCountry(event, index, value);
    }

    handleCloseDrawer(){
        this.setState({openDrawer: false})
    }

    handleOpenDrawer(){
        this.setState({openDrawer: true})
    }

    handleLogout(){
        this.props.logout()
        this.setState({openDrawer: false});
    }

    handleClosePostSnackBar(){
      this.setState({closepostsnackbar: false});
    }

    closePost(postId){
      var reference = this.props.firebase.database().ref('/pets/' + postId)
      reference.update({closed: true}).then((resp) => {
        this.setState({closepostsnackbar: true});
      })
    }

    render(){
      
      if(this.state.mypetslist){
        var petsList = this.state.mypetslist.map((pet) => 
          <ListItem key={pet.key} primaryText={pet.name + ' '+ pet.breed} rightIcon={<Cancel />} onTouchTap={() => this.closePost(pet.key)}/>
        );  
      }
      return(
        <div>
            <AppDrawer 
              openDrawer={ this.state.openDrawer }
              handleCloseDrawer={ this.handleCloseDrawer }
              handleLogout={this.handleLogout}
              mypetsChangeTrue={this.mypetsChangeTrue}
              mypetsChangeFalse={this.mypetsChangeFalse}
            />
            <AppBar title={<SearchBar 
                              searchcountry={this.state.searchcountry}
                              searchstate={this.state.searchstate}
                              searchcity={this.state.searchcity} 
                              handleSearchCountry={this.handleSearchCountry}
                              handleSearchState={this.handleSearchState}
                              handleSearchCity={this.handleSearchCity}
                            />} 
                    style={{ backgroundColor: '#8BC34A' }}
                    onLeftIconButtonTouchTap={() => this.handleOpenDrawer()}
                    className="title-font"
                    iconElementRight={<FlatButton label="Publicar" onTouchTap={() => this.props.handleOpen()}/>} 
            />
            { this.state.mypets ?
              <div className="container">
                 <List className="align-left">
                  <Subheader>Mis publicaciones</Subheader>
                  { petsList }
                </List>
              </div>
              :
              <div className="container">
                { this.state.pets.length ? 
                  <PetCard 
                    pet={ this.state.pets[this.state.pivot]} 
                    firebase={this.props.firebase} 
                    movePivotLeft={ this.movePivotLeft }
                    movePivotRight={ this.movePivotRight }
                  /> : this.state.empty ? <div><Subheader>No se encontraron puppianos</Subheader></div>
                        :<CircularProgress size={80} thickness={5} />
                }
              </div>  

            }
            
            <NewPost {...this.props} handleChange={this.handleChange} />
            <Snackbar
              open={this.props.openSnackbar}
              message={this.props.snackBarResponse}
              autoHideDuration={4000}
              onRequestClose={this.props.handleCloseSnackbar}
            />
            <Snackbar
              open={this.state.closepostsnackbar}
              message="Publicacion eliminada con exito"
              autoHideDuration={4000}
              onRequestClose={this.handleClosePostSnackBar}
            />
        </div>
      )
    }
}