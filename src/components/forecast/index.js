import { h, render, Component } from 'preact';
import style from './style_forecast';
import WeatherItem from '../weatherItem';

export default class Forecast extends Component {
    // Constructor function to initialize the component state with default values.
    constructor(props) {
        super(props);
        this.state = {
            displayFuture: false, // whether to show the future forecast
            startIdx: 0, // start index of the forecast array to be displayed
            endIdx: 4, // end index of the forecast array to be displayed
            added: 4, // number of forecast items displayed so far
        };
    }

    // Function to display the 24-hour forecast starting from the current time.
    getCurrent = () => {
        this.setState(() => ({
            startIdx: 0,
            endIdx: 4,
            displayFuture: false,
            added: 4,
        }));
    };
    
    // Function to display the next forecast hour in the list.
    getNextHour = () => {
        this.setState((prevState) => {
            const newEndIdx = prevState.endIdx + 1; // increment the number of elements to show by 1, but not beyond 9
            const newStartIdx = prevState.startIdx + 1;
            const newAdded = prevState.added + 1;
            
            if (newAdded > 8) {
                return null; // If we have shown 8 forecast items already (for the next 24 hours), do not display anything.
            } else {
                return {
                    startIdx: newStartIdx,
                    endIdx: newEndIdx,
                    displayFuture: false,
                    added: newAdded,
                };
            }
        });
    };

    // Function to display the forecast for the next day starting from midnight.
    getTommorrow = () => {
        this.setState((prevState) => {
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

    // Function to display the forecast for the next 4 days.
    getNextFive = () => {
        this.setState((prevState) => {
            return {
                startIdx: 9,
                endIdx: 40,
                displayFuture: true,
                added: 9,
            };
        });
    };

    // The main render method for the Forecast component.
    render() {
        const { endIdx, startIdx } = this.state;

        return (
            <div className={style.cont}>
                <div className={style.rowContainer}>
                    {/* Button to show the 24-hour forecast. */}
                    <button onClick={this.getCurrent}> 24h </button>
                    {/* Button to show the forecast for tomorrow. */}
                    <button onClick={this.getTommorrow}> Tomorrow </button>
                    {/* Button to show the forecast for the next 4 days. */}
                    <button onClick={this.getNextFive}> Next 4 Days </button>
                </div>
                {/* Display the forecast items based on the current state. */}
                {this.props.data ? (
                    <div className={style.rowContainer}>
                        {/* Display the weather items for the current forecast. */}
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