// import preact
import { h, render, Component } from 'preact';
// import stylesheets 
import style from './style';
// import jquery for API calls
import $ from 'jquery';

// import components
import Forecast from '../forecast';
import Search from '../search';
import Header from '../header';
import Panel from '../panel';
import Warnings from '../warnings';

// API key for weather data
const API_KEY = "f01a60b785b3768cea4113877c7c2a72"

// This component is essentially the root component and it hosts all the other components
export default class Iphone extends Component {
	// A constructor that sets initial states for the component
	constructor(props){
		super(props);
		this.setState({
			location: "London",
			displaySearchPanel: false,

		});

		// Fetching the current weather data and forecast data using two API calls
		this.fetchCurrentWeatherData();
		this.fetchForecastData();
	}

	// This function fetches the current weather data from the OpenWeatherMap API using the location state
	fetchCurrentWeatherData = () => {
		var url = `http://api.openweathermap.org/data/2.5/weather?q=${this.state.location}&units=metric&APPID=${API_KEY}`;
		$.ajax({
			url: url,
			dataType: "jsonp",
			// If the API call is successful, the fetched data is stored in the currWeather state
			success : (parsed_json) => {
				this.setState({
					currWeather: parsed_json
				});
			},
			// If the API call fails, an error message is logged and an alert is shown to the user
			error : function(req, err){ 
				console.log('API call failed ' + err);
				alert('Sorry, location is not available at the moment. Please try again later.');
			}
		})
	}


	// Fetch forecast weather data for the next 5 days
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

	// Switches between showing the information and search panels
	// Triggered by the bottom buttons - Search / Go Back
	displaySearchPanel = (value) => {
		this.setState({ displaySearchPanel: value });
	}

	// Triggered from within the Search component when a new location is selected
	handleSelect = (value) => {
		this.setState({ location: value }); 

		// Fetch current weather data and forecast data for the new location
		this.fetchCurrentWeatherData();
		this.fetchForecastData();
	};


	// Main render method for the iphone component
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
						/* Search Panel */
					) : <Search onSelect={this.handleSelect} onBack={this.displaySearchPanel} />} 
				</div>
			</div>

		);
	}
}


