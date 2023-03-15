import { h, render, Component } from 'preact';
import style from './style_panel';


// Component displays the precipitation percentage, pressure, and wind speed 
// of the current weather and forecasts temperature for current day.
export default class Panel extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        let pressure, wind, precipitationPercentage;

        if (this.props.todayWeather) {
            pressure = parseInt(this.props.todayWeather['main']['pressure']);
            wind = parseInt(this.props.todayWeather['wind']['speed']);
        }

        // The precipitation percentage is not provided in the current day's weather data.
        // Instead, it is obtained from the forecast data which is also passed down
        if(this.props.forecastWeather) {
            let precipitation = this.props.forecastWeather.list.slice(0, 1)[0]['pop']; // value between 0 and 1
            precipitationPercentage = (precipitation * 100).toFixed(0);
        }

        return (
            (this.props.todayWeather && this.props.forecastWeather) ? (
                <div class={style.bg}>
                    <div class={ style.container }>
                        <div class={style.ss}>rain: {precipitationPercentage} %</div>
                        <div class={style.ss}>pressure: {pressure} hPa</div>
                        <div class={style.ss}>wind: {wind} m/s</div>
                    </div>
                </div>
            ) : null 
        );
    }
}