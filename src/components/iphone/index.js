// import preact
import { h, render, Component } from 'preact';
// import stylesheets 
import style from './style';
// import jquery for API calls
import $ from 'jquery';

import Forecast from '../forecast';
import Search from '../search';
import Header from '../header';
import Panel from '../panel';
import Warnings from '../warnings';

// api key for weather data
const API_KEY = "f01a60b785b3768cea4113877c7c2a72"

// Essentially root component - hosts all other components
export default class Iphone extends Component {
	// a constructor with initial set states
	constructor(props){
		super(props);
		this.setState({
			location: "London",
			displaySearchPanel: false,

		});

		// fecthing the data
		this.fetchCurrentWeatherData();
		this.fetchForecastData();
	}

	// fetch current weather data 
	fetchCurrentWeatherData = () => {
		var url = `http://api.openweathermap.org/data/2.5/weather?q=${this.state.location}&units=metric&APPID=${API_KEY}`;
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : (parsed_json) => {
				this.setState({
					currWeather: parsed_json
				});
			},
			error : function(req, err){ console.log('API call failed ' + err); }
		})
	}


	/// fetch forecast weather data - for next 4 days
	fetchForecastData = () => {
		var url = `http://api.openweathermap.org/data/2.5/forecast?q=${this.state.location}&units=metric&APPID=${API_KEY}`;
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : (parsed_json) => {
				this.setState({
					forecast: parsed_json
				});
			},
			error : function(req, err){ console.log('API call failed ' + err); }
		})
	}

	// switches between showing the information / search panels
	// triggered by the bottom buttons - Search / Go Back
	displaySearchPanel = (value) => {
		this.setState({ displaySearchPanel: value });
	}

	// triggered from the Search component - new location selected
	handleSelect = (value) => {
		this.setState({ location: value }); // setting new location
		this.fetchCurrentWeatherData();
		this.fetchForecastData();
	};


	// the main render method for the iphone component
	render() {
		return (
			<div class={style.container} id="iphone">
				<Header class={style.header} data={this.state.currWeather}/>
				<div class={style.body}> 
					{!this.state.displaySearchPanel ? (
						<div class={style.box}>
							{/* Intro panel with precipitation / pressure / wind speed */}
							<Panel todayWeather={this.state.currWeather} forecastWeather={this.state.forecast}/>
							
							{/* Warnings panel */}
							<Warnings />
							
							{/* Forecast panel  */}
							<Forecast data={this.state.forecast}/>

							{/* Switch to Search Panel */}
							<button  onClick={this.displaySearchPanel}>Search</button>
						</div>
					) : <Search onSelect={this.handleSelect} onBack={this.displaySearchPanel} />} 
				</div>
			</div>

		);
	}
}


