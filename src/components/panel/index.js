import { h, render, Component } from 'preact';
import style from './style_panel';

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

        // forecast data from parent needed too because current day weather
        // doesn't supply precipitation percentage, only mm over last hour
        if(this.props.forecastWeather) {
            let precipitation = this.props.forecastWeather.list.slice(0, 1)[0]['pop']; // value between 0 and 1
            precipitationPercentage = (precipitation * 100).toFixed(0);
        }

        return (
            (this.props.todayWeather && this.props.forecastWeather) ? (
                <div class={style.bg}>
                    <div class={ style.container }>
                        <div class={style.ss}>{precipitationPercentage} %</div>
                        <div class={style.ss}>{pressure} hPa</div>
                        <div class={style.ss}>{wind} m/s</div>
                    </div>
                </div>
            ) : null 
        );
    }
}