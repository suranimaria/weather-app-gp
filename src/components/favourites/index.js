import { h, render, Component } from 'preact';
import style from './style_favourites';

// Panel for seeing saved locations
export default class Favourites extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: this.props.savedLocations,
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
      this.props.onBack();
    }

    
    // display list of saved locations and allow user to select one
    viewSavedLocations = () => {
        const locationsList = this.state.locations.map((location, index) => {
          return (
            <div class={style.itemList} key={index} onClick={this.selectLocation}>{location}</div>
          );
        });
        return locationsList;
      }


    render() {
        return (
            <div class={style.container}>
                {this.state.locations.length > 0 ? (
                  <div>
                    <p class={style.title}>Saved Locations</p>
                    {this.viewSavedLocations()}
                  </div>
                ) : (
                  <p>No saved locations yet!</p>
                )}

                <button onClick={this.goBack}>Go back</button>      
                
            </div>
        );
    }
}