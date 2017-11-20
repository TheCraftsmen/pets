import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import axios from 'axios';

export default class SelectFieldUrl extends Component{

	constructor(props){
		super(props);
		this.state = {items: []}
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.api && this.props.api){
			if(nextProps.api !== this.props.api){
				axios.get(this.props.url + '/' + nextProps.api + '?' + this.props.filter)
				.then((resp) => {
					if(this.props.apiAttr){
						return this.setState({items: resp.data[this.props.apiAttr]});
					} else {
						return this.setState({items: resp.data});
					}
				});
			}
		}
	}


	componentDidMount(){
		if(this.props.api){
			axios.get(this.props.url + '/' + this.props.api + '?' + this.props.filter)
			.then((resp) => {
				if(this.props.apiAttr){
					return this.setState({items: resp.data[this.props.apiAttr]});
				} else {
					return this.setState({items: resp.data});
				}
			});
		}
	}

	render(){
		if(this.state.items){
			var MapItems = this.state.items.map((item) => {
				return <MenuItem key={item.id} value={item.id} primaryText={item.name} />
			});	
		}	
		return(
			<SelectField onChange={this.props.onChange} value={this.props.value} >
				{ MapItems }
			</SelectField>
		)
	}

}