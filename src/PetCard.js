import React, { Component } from 'react';
import {Card, CardActions, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Favorite from 'material-ui/svg-icons/action/favorite';
import Left from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import Right from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class PetCard extends Component{

	constructor(props){
		super(props);
		this.state = { fullpath: null , favorite: false }
		this.favoriteOpen = this.favoriteOpen.bind(this);
		this.favoriteClose = this.favoriteClose.bind(this);
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.pet.filename && this.props.pet.filename){
			if(nextProps.pet.filename !== this.props.pet.filename){
				let storageRef = this.props.firebase.storage().ref().child(nextProps.pet.filename);
				storageRef.getDownloadURL().then((url) => {
					this.setState({fullpath: url})
				}).catch((error) => {
					console.log(error)
				})		
			}
		}
	}

	componentDidMount(){
		let storageRef = this.props.firebase.storage().ref().child(this.props.pet.filename);
		storageRef.getDownloadURL().then((url) => {
			this.setState({fullpath: url})
		}).catch((error) => {
			console.log(error)
		})
	}

	favoriteOpen(){
      this.setState({favorite: true});
    }

    favoriteClose(){
      this.setState({favorite: false});
    }

	render(){
		const favoriteActions = [
	        <FlatButton
	          label="Ok"
	          primary={true}
	          keyboardFocused={true}
	          onTouchTap={() => this.favoriteClose()}
	        />,
	    ];
		return(
			
             	<Card >
					    <CardMedia>
					    {this.state.fullpath ? 
					    	<img src={ this.state.fullpath } alt="" width="400" height="400" /> :
					    	<CircularProgress size={80} thickness={5} />
					    }
                        </CardMedia>
					    <CardTitle title={ this.props.pet.name} subtitle={this.props.pet.breed} />
					    <CardText>
					      { this.props.pet.description}
					    </CardText>
					    <CardActions>
						    <FloatingActionButton 
						    	onTouchTap={ () => this.props.movePivotLeft()}
						    	backgroundColor='#4CAF50'
						   	>
	                  			<Left />
	                		</FloatingActionButton>
	                		<FloatingActionButton 
	                			secondary={true}
	                			onTouchTap={ () => this.favoriteOpen() }
	                		>
	                  			<Favorite />
	                		</FloatingActionButton>
						    <FloatingActionButton  
						    	onTouchTap={ () => this.props.movePivotRight()}
						    	backgroundColor='#4CAF50'
						    >
	                  			<Right />
	                		</FloatingActionButton>
					    </CardActions>
					    <Dialog
			              title="Informacion adicional"
			              actions={favoriteActions}
			              modal={false}
			              open={this.state.favorite}
			              onRequestClose={() => this.favoriteClose()}
            			>
              				{ this.props.pet.contact ? this.props.pet.contact : "No disponible" }
        				</Dialog>
				</Card>
		)
	}
}