import { h, render, Component } from 'preact';
// import jquery for API calls
import $ from 'jquery';
import style from './style_search';

// Search component for finding new locations
export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: [],
            savedLocations: [],
            showSavedLocations: false,
    }
}

    // fetch cities that start with the prefix put by the user - sorted by population
    fetchLocation = (location) => {
		$.ajax({
			method: 'GET',
			url: `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=5&namePrefix=${location}&sort=-population`,
			headers: {
			  'X-RapidAPI-Key': '09c5203f1fmsh7dbfb449aa14d85p19e08bjsnb51b038c876c',
			  'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
			},
			success : (parsed_json) => {
				this.setState({
					cities: parsed_json.data,
				});
			},
			error: function (error) {
			  console.error(error);
			}
		});

        this.setState({ placeHolder: "Enter location" });
	}

    // triggered when the input value changes
    handleChange = (event) => {
		this.fetchLocation(event.target.value)
	}

    // triggered when the user presses the "enter" key while the input is focused
    handleKeyPress = (event) => {
        if (event.key === "Enter") {
            this.fetchLocation(event.target.value)
        }
	}

    // triggered when the user clicks on one of the cities from the list
    selectLocation = (event) => {
      
      let innerHTML = event.target.innerHTML;
      let city = innerHTML.split(',')[0];
      this.setState({ location: city }); // setting new location
          this.props.onSelect(city);
	}

    // triggered when the "Go Back" button is clicked
    goBack = () => {
      this.props.onBack(this.state.savedLocations);
    }

    // save current location to the list of saved locations
    saveLocation = () => {
        if (this.state.location && !this.state.savedLocations.includes(this.state.location)) {
            const newSavedLocations = [...this.state.savedLocations, this.state.location];
            this.setState({ savedLocations: newSavedLocations });
            alert(`Location '${this.state.location}' has been saved.`);
        }
    }


    render() {
        return (
            <div class={style.container}>
                <input
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                    placeholder='Enter location..'
                    class={style.search}
                    type="text"
                />
                {/* Outputs first 5 results of cities that match user input */}
                { this.state.cities ? this.state.cities.map((item) => (
                    <div class={style.itemList} onClick={this.selectLocation}> {item.city}, {item.countryCode} </div>)
                ) : null}

                    
                <div class={style.buttonContainer}>
                  <button onClick={this.goBack}>Apply changes</button>
                  <button onClick={this.saveLocation}>Save Location</button>
                </div>      
            </div>
        );
    }
}