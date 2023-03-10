import { h, render, Component } from 'preact';
// import jquery for API calls
import $ from 'jquery';
import style from './style_search';

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.setState({ placeholder: 'Enter location..' });
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
            </div>
        );
    }
}