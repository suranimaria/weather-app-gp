import { h, render, Component } from 'preact';
import style from './style_warnings';
import $ from 'jquery';

export default class Warnings extends Component {
    constructor(props) {
        super(props);
        // Call the function to fetch the warnings data
        this.fetchWarnings();
    }
// Fetches the warnings data from a JSON file using jQuery's AJAX method
    fetchWarnings = () => {
        $.getJSON('../../assets/data/extreme-weather-warnings.json', (data) => {
          this.setState({
            warnings: data.warnings
          });
            // console.log(data.warnings[0])
        })
        // Log an error message to the console if the data cannot be fetched
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
               // If the warnings data has not been fetched yet, display a loading message
              <p>Loading warnings...</p>
            )}
          </div>
        );
      }
}