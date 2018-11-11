import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import Clock from 'react-clock'

import './index.css'

const timeFormat = 'hh:mm:ss A'

class App extends Component {
  componentDidMount = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async position => {
        const resp = await fetch(
          `https://api.sunrise-sunset.org/json?lat=${position.coords.latitude
            .toString()
            .substring(0, 9)}&lng=${position.coords.longitude
            .toString()
            .substring(0, 9)}&date=today`,
        )
        const json = await resp.json()
        // const TC = 4 * (-60 - position.coords.longitude) - 0.094
        console.log('coords', position.coords)
        const sunrise = moment(json.results.sunrise, timeFormat).subtract(5, 'h')
        const sunset = moment(json.results.sunset, timeFormat).subtract(5, 'h')
        const halfDiff = Math.abs(sunset.diff(sunrise, 'm')) / 2
        console.log('halfDiff', halfDiff)
        console.log('hour', halfDiff / 60)
        console.log('minute', halfDiff % 60)
        console.log(
          'solarMidnight',
          moment(sunrise)
            .subtract(halfDiff, 'm')
            .format(timeFormat),
        )
        this.setState(() => ({
          sunrise,
          sunset,
          solarNoon: moment(sunrise).add(halfDiff, 'm'),
          solarMidnight: moment(sunrise).subtract(halfDiff, 'm'),
          // solarNoon: moment('12:00:00 PM', timeFormat).add(TC, 'm'),
          // solarMidnight: moment('00:00:00 AM', timeFormat).add(TC, 'm'),
          loading: false,
        }))
      })
    }
  }

  state = {
    loading: true,
    sunrise: '',
    sunset: '',
    solarNoon: '',
    solarMidnight: '',
  }

  render() {
    const { loading, sunrise, sunset, solarNoon, solarMidnight } = this.state
    return loading ? (
      'Loading...'
    ) : (
      <div style={{ display: 'flex' }}>
        <div className="column">
          <div>
            <h1>Sunrise</h1>
            <h2>{sunrise.format(timeFormat)}</h2>
          </div>
          <div>
            <Clock value={sunrise.toDate()} />
          </div>
        </div>
        <div className="column">
          <div>
            <h1>Noon</h1>
            <h2>{solarNoon.format(timeFormat)}</h2>
          </div>
          <div>
            <Clock value={solarNoon.toDate()} />
          </div>
        </div>
        <div className="column">
          <div>
            <h1>Sunset</h1>
            <h2>{sunset.format(timeFormat)}</h2>
          </div>
          <div>
            <Clock value={sunset.toDate()} />
          </div>
        </div>
        <div className="column">
          <div>
            <h1>Midnight</h1>
            <h2>{solarMidnight.format(timeFormat)}</h2>
          </div>
          <div>
            <Clock value={solarMidnight.toDate()} />
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
