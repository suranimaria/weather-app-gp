import { h, render, Component } from 'preact';
import style from './style_header';

// Top part of the screen - Location / Date / Current, Min, Max Temperature
export default class Header extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        let location, temp, date, temp_min, temp_max;

        // props is data passed from parent (iphone component) 
        // props.data = current weather forecast
        if (this.props.data) {
            location = this.props.data['name'];
            temp = parseInt(this.props.data['main']['temp']);
            temp_min = parseInt(this.props.data['main']['temp_min']);
            temp_max = parseInt(this.props.data['main']['temp_max']);
            date = new Date().toLocaleString('en-US', {weekday: 'short', month: 'short', day: 'numeric'});
        }

        console.log(typeof(date))

        return (
            this.props.data ? (
                <div class={style.header}>
                    <div class={style.locationBox}>
                        <div class={style.city}>{location}</div>
                        <div class={style.date}>{date}</div>
                    </div>

                    <div class={style.tempBox}>
                        <span class={style.temp}>{temp}°</span>
                        <div>
                            <span>L:{temp_min}° </span>
                            <span>H:{temp_max}°</span>
                        </div>
                    </div>
                </div>
            ) : null 
        );
    }
}