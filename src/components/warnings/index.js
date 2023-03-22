import { h, render, Component } from 'preact';
import style from './style_warnings';
import $ from 'jquery';

export default class Warnings extends Component {
  constructor(props) {
    super(props);
    this.fetchWarnings();
  }

  fetchWarnings = () => {
    $.getJSON('../../assets/data/extreme-weather-warnings.json', (data) => {
      this.setState({
        warnings: data.warnings
      });
    })
    .fail((errorThrown) => {
      console.error('Failed to fetch warnings: ' + errorThrown);
    });
  }

  render() {
    const {warnings} = this.state;
    let randomWarnings = [];

    // Check if warnings array has been populated
    if (warnings) {
      // Pick 3 random warnings
      while (randomWarnings.length < 3) {
        const randomIdx = Math.floor(Math.random() * warnings.length);
        if (!randomWarnings.includes(randomIdx)) {
          randomWarnings.push(randomIdx);
        }
      }
    }

    // Choose a random color from the array
    const colors = ['yellow', 'red', 'amber'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    return (
      <div class={style.container}>
        <h2 class={`${style.title} ${style[color]}`}>{color[0].toUpperCase() + color.slice(1)} Weather Warning</h2>
        {warnings ? (
          <div class={style.list}>
            {randomWarnings.map((idx) => (
              <div class={style.item}>
                <h3 class={style.warningTitle}>{warnings[idx].title}</h3>
                <p class={style.warningDescription}>{warnings[idx].description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Loading warnings...</p>
        )}
      </div>
    );
  }
}
