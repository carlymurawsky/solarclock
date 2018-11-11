import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment'

const timeFormat = 'H:mm'

class App extends Component {
  state = {
    sunrise: '',
    sunset: '',
    solarNoon: '',
    solarMidnight: '',
  }
  onChange = ({target}) => {
    const {name, value} = target
    this.setState(()=>({[name]:value}))
  }

  getSolar = (e) => {
    e.preventDefault()
    const sunrise = moment(this.state.sunrise, timeFormat)
    const sunset = moment(this.state.sunset, timeFormat)
    const halfDiff = Math.abs(sunrise.diff(sunset, 'm')) / 2
    const solarNoon = sunrise.add(halfDiff, 'm').format(timeFormat)
    const solarMidnight = sunset.add(halfDiff, 'm').format(timeFormat)
    this.setState(()=>({solarNoon, solarMidnight}))
  }

  render() {
    const {sunrise, sunset,solarNoon, solarMidnight } = this.state
    return (
        <div>
          <form onSubmit={this.getSolar}>
            <p>
              <input name="sunrise" type="text" onChange={this.onChange} value={sunrise}/>
            </p>
            <p>
              <input name="sunset" type="text" onChange={this.onChange} value={sunset}/>
            </p>
            <button type="submit">Get Solar</button>
          </form>
          <p>
            Solar Noon: {solarNoon}
          </p>
          <p>
            Solar Midnight: {solarMidnight}
          </p>
        </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
