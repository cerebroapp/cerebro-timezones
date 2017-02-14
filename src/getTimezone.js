import { memoize } from 'cerebro-tools'

const getTimezone = (location, lang = 'en') => {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${encodeURIComponent(location)}&key=AIzaSyB6o13RI1WBFHCX0S8kdye6aoPaBID4K9k&timestamp=${timestamp}`
  return fetch(url).then(response => response.json())
}

module.exports = memoize(getTimezone)
