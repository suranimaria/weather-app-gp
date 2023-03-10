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
            // console.log(data.warnings[0])
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
    
        return (
          <div class={style.container}>
            <h2 class={style.title}>{['Yellow', 'Red', 'Amber'][Math.floor(Math.random() * 3)]} Weather Warning</h2>
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