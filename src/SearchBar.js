import React, { Component } from 'react';
import SelectFieldUrl from './SelectFieldUrl';
import './App.css';

export default class SearchBar extends Component{

	render(){
		return(
			<div className="search-bar" >
				<SelectFieldUrl
					url="https://api.mercadolibre.com"
					api="countries"
					filter="attributes=id,name"
					value={this.props.searchcountry}
					onChange={this.props.handleSearchCountry}
				 />
				 {
				 	this.props.searchcountry ?
					<SelectFieldUrl
					url="https://api.mercadolibre.com/countries"
					api={ this.props.searchcountry }
					filter="attributes=states"
					value={this.props.searchstate}
					onChange={this.props.handleSearchState}
					apiAttr="states"
					/> :
					<div></div>
				 }
				 {
				 	this.props.searchstate ?
				 	<SelectFieldUrl
					url="https://api.mercadolibre.com/states"
					api={ this.props.searchstate }
					filter="attributes=cities"
					value={this.props.searchcity}
					onChange={this.props.handleSearchCity}
					apiAttr="cities"
					/> :
					<div></div>
				 }
				
				
			</div>
		)
	}

}