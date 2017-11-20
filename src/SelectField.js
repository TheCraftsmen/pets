import React, { Component } from 'react';
import axios from 'axios';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


export default class SelectField2 extends Component{

	constructor(props){
		super(props);
		this.state = {items: []}
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.country && this.props.country){
			if(nextProps.country !== this.props.country){
				axios.get('https://api.mercadolibre.com/countries/'+ nextProps.country + '?attributes=states')
				.then((resp) => {
					return this.setState({items: resp.data.states});
				});
			}
		} else if (nextProps.countrystate && this.props.countrystate){
			if(nextProps.countrystate !== this.props.countrystate){
				axios.get('https://api.mercadolibre.com/states/'+ nextProps.countrystate + '?attributes=cities')
				.then((resp) => {
					return this.setState({items: resp.data.cities});
				});	
			}

		}
	}

	componentDidMount(){
		if(this.props.country){
			axios.get('https://api.mercadolibre.com/countries/'+ this.props.country + '?attributes=states')
			.then((resp) => {
				return this.setState({items: resp.data.states});
			});
		} else if(this.props.countrystate){
			axios.get('https://api.mercadolibre.com/states/'+ this.props.countrystate + '?attributes=cities')
			.then((resp) => {
				return this.setState({items: resp.data.cities});
			});
		}
	}

	render(){
		var MapItems = this.state.items.map((item) => {
			return <MenuItem key={item.id} value={item.id} primaryText={item.name} />
		});
		return(
			<SelectField
				floatingLabelText={this.props.title}
				onChange={this.props.onChange}
				value={this.props.value}
				>
				{ MapItems }
			</SelectField>
		)
	}
}

