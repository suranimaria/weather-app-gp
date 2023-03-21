import { h, render, Component } from 'preact';
import style from './style_weatherItem';
// Defining the WeatherItem component
export default class WeatherItem extends Component {
    render() {
      // Destructuring props to get required information
      const { item, displayFuture, index } = this.props;
      const date = new Date(item.dt * 1000);
      // If the displayFuture prop is false, render current weather information
      if (!displayFuture) {
        return (
          <div className={style.container}>
            <label>{date.toLocaleString('en-US', { hour: 'numeric', hour12: true })}</label>
            <div>
              <img
                src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                alt=""
                className={style.icon}
              />
            </div>
            <label class={style.precipitation}>{(item.pop * 100).toFixed(0)}%</label>
            <label>{Math.round(item.main.temp)}°C</label>
          </div>
        );
      }
   // If the displayFuture prop is true and the index is a multiple of 8, render future weather information for a particular day
      if (index % 8 === 0) {
        return (
          <div className={style.container}>
            <label>
              {date.toLocaleString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })}
            </label>
            <div>
              <img
                src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                alt=""
                className={style.icon}
              />
            </div>
            <label class={style.precipitation}>{(item.pop * 100).toFixed(0)}%</label>
            <label>{Math.round(item.main.temp)}°C</label>
          </div>
        );
      }
  // If the displayFuture prop is true and the index is not a multiple of 8, don't render anything
      return null;
    }
  }