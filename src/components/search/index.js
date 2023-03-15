import { h, render, Component } from 'preact';
// import jquery for API calls
import $ from 'jquery';
import style from './style_search';

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.setState({ placeholder: 'Enter location..' });
        this.state = {
            cities: [],
            savedLocations: [],
            showSavedLocations: false
    }
}

    // api call to get cities that start with the prefix put by the user - sorted by population
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

    // fetch new locations for the prefix when the user clicks away
    handleChange = (event) => {
		this.fetchLocation(event.target.value)
	}

    // fetch new locations for the prefix when the user clicks enter
    handleKeyPress = (event) => {
        if (event.key === "Enter") {
            this.fetchLocation(event.target.value)
        }
	}

    // triggered when the user clicks on one of the cities from list
    onClick = (event) => {
		let innerHTML = event.target.innerHTML;
		let city = innerHTML.split(',')[0];
		this.setState({ location: city }); // setting new location
        this.props.onSelect(city);
	}

    goBack = () => {
        this.props.onBack(false);
    }

    // save current location to the list of saved locations
    saveLocation = () => {
        if (this.state.location && !this.state.savedLocations.includes(this.state.location)) {
            const newSavedLocations = [...this.state.savedLocations, this.state.location];
            this.setState({ savedLocations: newSavedLocations });
            alert(`Location '${this.state.location}' has been saved.`);
        }
    }

    
    // display list of saved locations and allow user to select one
    viewSavedLocations = () => {
        const locationsList = this.state.savedLocations.map((location, index) => {
          return (
            <div class={style.itemList} key={index} onClick={this.onClick}>{location}</div>
          );
        });
        return locationsList;
      }


    //Toggle the saved locations visibility
    toggleVisibility() {
        var div = document.getElementById("savedLocations");
        if (div.style.display === "none") {
          div.style.display = "block";
        } else {
          div.style.display = "none";
        }
      }
      
      
      



    render() {
        console.log(this.state)
        return (
            <div class={style.container}>
                <input
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                    placeholder={this.state.placeholder}
                    class={style.search}
                    type="text"
                />
                {/* Outputs first 5 results of cities that match user input */}
                { this.state.cities ? this.state.cities.map((item) => (
                    <div class={style.itemList} onClick={this.onClick}> {item.city}, {item.countryCode} </div>)
                ) : null}

                    
            
                <button onClick={this.goBack}>Apply changes</button>
                <button onClick={this.saveLocation}>Save Location</button>
                <button onclick={this.toggleVisibility}>View Saved Locations</button>
                
                
                {this.state.savedLocations.length > 0 && (
                    <div id="savedLocations" class={style.savedLocations} style="display:none">
                    <h3>Saved Locations</h3>
                    {this.viewSavedLocations()}
                </div>
                )} 
                
            </div>
        );
    }
}