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
import Favourites from '../favourites';

// API key for weather data
const API_KEY = "f01a60b785b3768cea4113877c7c2a72"

// This component is essentially the root component and it hosts all the other components
export default class Iphone extends Component {
	// A constructor that sets initial states for the component
	constructor(props){
		super(props);
		this.setState({
			location: "London",
			displayHomeScreen: true,
			displaySearchPanel: false,
			displayFavouritesPanel: false,
			savedLocations: []
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

	// Displays the searching panel
	// Triggered by the bottom button - Search
	displaySearchPanel = () => {
		this.setState({ 
			displaySearchPanel: true,
			displayHomeScreen: false,
			displayFavouritesPanel: false,
		});
	}

	// Triggered from within Search / Favourites panel to return to home screen
	// via Apply Changes / Go Back button
	displayHomeScreen = (updatedSavedLocations) => {
		if (updatedSavedLocations) {
			this.setState({ savedLocations: updatedSavedLocations });
		}
		this.setState({ 
			displayHomeScreen: true,
			displaySearchPanel: false,
			displayFavouritesPanel: false,
		});

		console.log(this.state.savedLocations)
	}

	// Displays the searching panel
	// Triggered by the bottom button - Favourites
	displayFavouritesPanel = () => {
		this.setState({ 
			displayFavouritesPanel: true,
			displayHomeScreen: false,
			displayHomeScreen: false,
		});
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
					{this.state.displayHomeScreen ? (
						<div class={style.box}>
							{/* Intro panel with precipitation / pressure / wind speed */}
							<Panel todayWeather={this.state.currWeather} forecastWeather={this.state.forecast}/>
							
							{/* Warnings panel */}
							<Warnings />
							
							{/* Forecast panel  */}
							<Forecast data={this.state.forecast}/>

							{/* Switch to Search Panel */}
							<button  onClick={this.displaySearchPanel}>Search</button>

							{/* Switch to Search Panel */}
							<button  onClick={this.displayFavouritesPanel}>Favourites</button>
						</div>
						/* Search Panel */
					) : null}
					{this.state.displaySearchPanel ? 
						<Search onSelect={this.handleSelect} onBack={this.displayHomeScreen} /> : null}
					{this.state.displayFavouritesPanel ? 
						<Favourites savedLocations = {this.state.savedLocations} onSelect={this.handleSelect} onBack={this.displayHomeScreen} /> : null} 
				</div>
			</div>

		);
	}
}


