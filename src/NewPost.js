import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Upload from 'material-ui-upload/Upload';
import SelectField from 'material-ui/SelectField';
import SelectField2 from './SelectField'

export default class NewPost extends Component{

	render(){
		const actions = [
	        <FlatButton
	          label="Cancelar"
	          primary={true}
	          onTouchTap={(e) => this.props.handleClose(e)}
	        />,
	        <FlatButton
	          label="Aceptar"
	          primary={true}
	          onTouchTap={(e) => this.props.handleNewPost(e)}
	        />,
	    ];
		var MapItems = this.props.countries.map((item) => {
			return <MenuItem key={item.id} value={item.id} primaryText={item.name} />
		});
		return(
			<Dialog
				title="Publicar"
				actions={actions}
				modal={false}
				open={this.props.open}>
				<TextField 
					hintText="Nombre" 
					id="dialog-text"
					onChange={(e) => this.props.setNameState(e.target.value)}
				/>
				<TextField 
					hintText="Raza" 
					id="dialog-text"
					onChange={(e) => this.props.setBreedState(e.target.value)}
				/>
				<TextField 
					hintText="Descripcion" 
					id="dialog-text"
					multiLine={true}
					rows={2}
					rowsMax={4}
					onChange={(e) => this.props.setDesState(e.target.value)}
				/>
				<TextField 
					hintText="Datos de contacto" 
					id="contact-text"
					multiLine={true}
					rows={2}
					rowsMax={4}
					onChange={(e) => this.props.setContactState(e.target.value)}
				/>
				<br />
				<SelectField
					floatingLabelText="Pais"
					value={this.props.country}
					onChange={this.props.handleChange} >
					{ MapItems }
				</SelectField>
				{ this.props.country ? 
				<SelectField2 
				  country={this.props.country} 
				  title={ "Estado" }
				  onChange={this.props.setCountryState}
				  value={this.props.countrystate}
				  id="countrystate"
				/>:
				<div></div>
				}
				{ this.props.countrystate ? 
				<SelectField2
				  countrystate={this.props.countrystate} 
				  title={ "Ciudad" }
				  onChange={this.props.setCity}
				  value={this.props.city}
				  id="city"
				/>:
				<div></div>
				}
				<Upload onFileLoad={this.props.onFileLoad}/>
	        </Dialog>
		)
	}
}