import { h, render, Component } from 'preact';
import style from './style_forecast';
import WeatherItem from '../weatherItem'

// This class represents a forecast component that displays 
// weather information for the next 24 hours or the next few days
export default class Forecast extends Component {

        // Constructor function that sets the initial state of the component
        constructor(props) {
            super(props);

            // Define the initial state of the component with the following properties:
            // 1. displayFuture: boolean value that toggles the display of future content or not
            // 2. startIdx: integer value that determines the starting index of the content to be displayed
            // 3. endIdx: integer value that determines the ending index of the content to be displayed
            // 4. added: integer value that tracks number of elements traversed 
            this.state = {
              displayFuture: false,
              startIdx: 0,
              endIdx: 4,
              added: 4,
            };
          }

        
        // A function that resets the state of the component to display the weather information for the next 24 hours
        getCurrent = () => {
            this.setState(() => ({
                startIdx: 0,
                endIdx: 4,
                displayFuture: false,
                added:4,
            }));
        };
        
        // A function that updates the state of the component to add a new element to the 3-hourly forecast
        getNextHour = () => {
            this.setState((prevState) => {
                const newStartIdx = prevState.startIdx + 1;
                const newAdded = prevState.added + 1;
                
                // If the added value exceeds 8, meaning that 24 hours of forecast data have been shown, 
                // return null to stop loading more data
                // Otherwise, return a new state object with the updated indices and added value
                if (newAdded > 8) {
                    return null; 
                } else {
                    return {
                        startIdx: newStartIdx,
                        endIdx: newStartIdx + 4,
                        displayFuture: false,
                        added: newAdded,
                    };
                }
            });
        };


        // A function that updates the state of the component to display the forecast information starting from the next day
        getTommorrow = () => {
            this.setState((prevState) => {
                // Find the index of the first element that represents the start of the next day (first 12AM element)
                const newDayStartIdx = this.props.data ? this.props.data.list.findIndex((item, idx) => {
                    const date = new Date(item.dt * 1000);
                    return date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0;
                }) : null;

                return {
                    startIdx: newDayStartIdx,
                    endIdx: newDayStartIdx + 4,
                    displayFuture: false,
                    added: 4,
                };
                
            });
        };

        // A function that updates the state of the component to display the forecast information for the next four days
        getNextFour = () => {
            this.setState((prevState) => {
                // Start index is set at 9 because there will be at most 8 element corresponding to today's weather
                // End index is set at 40 to traverse the entire array (fixed size of 40 returned from the API)
                return {
                    startIdx: 9,
                    endIdx: 40,
                    displayFuture: true,
                    added: 9,
                };
                
            });
        };

        // Main render method for the Forecast component
        render() {
            const { endIdx, startIdx } = this.state;

            return (
                <div className={style.cont}>
                    <div className={style.rowContainer}>
                        <button onClick={this.getCurrent}> 24h </button>
                        <button onClick={this.getTommorrow}> Tomorrow </button>
                        <button onClick={this.getNextFour}> Next 4 Days </button>

                    </div>
                    {this.props.data  ? (
                        <div className={style.rowContainer}>
                            {this.props.data.list.slice(startIdx, endIdx).map((item, idx) => (
                                <WeatherItem key={idx} item={item} displayFuture={this.state.displayFuture} index={idx} />
                            ))}
                            {!this.state.displayFuture ? (
                                <button class={style.nextButton} onClick={this.getNextHour}> >> </button>
                            ) : null} 
                        </div>
                    ) : null}
                </div>
            );
        }
    }