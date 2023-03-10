import { h, render, Component } from 'preact';
import style from './style_forecast';
import WeatherItem from '../weatherItem'

export default class Forecast extends Component {
        // a constructor with initial set states
        constructor(props) {
            super(props);
            this.state = {
              displayFuture: false,
              startIdx: 0,
              endIdx: 4,
              added: 4,
            };
          }

        getCurrent = () => {
            this.setState(() => ({
                startIdx: 0,
                endIdx: 4,
                displayFuture: false,
                added:4,
            }));
        };
        
        // sets up the indices to get gets the next forecast from the list 
        getNextHour = () => {
            this.setState((prevState) => {
                const newEndIdx = prevState.endIdx + 1; // increment the number of elements to show by 1, but not beyond 9
                const newStartIdx = prevState.startIdx + 1;
                const newAdded = prevState.added + 1;
                
                if (newAdded > 8) {
                    return null; // reached 24h forecast = 8 element = each element is the forcast over 3 hours
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


        // sets up the indices to get the forecast starting from first 12AM element = next day
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

        // sets up the indices to get forecast over next days
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

        // the main render method for the iphone component
        render() {
            const { endIdx, startIdx } = this.state;

            return (
                <div className={style.cont}>
                    <div className={style.rowContainer}>
                        <button onClick={this.getCurrent}> 24h </button>
                        <button onClick={this.getTommorrow}> Tomorrow </button>
                        <button onClick={this.getNextFive}> Next 4 Days </button>

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