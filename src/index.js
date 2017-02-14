'use strict';

const geocode = require('./geocode')
const getTimezone = require('./getTimezone')
const path = require('path')

const formatLocation = ({lat, lng}) => `${lat},${lng}`

const parseAddress = (address_components) => {
  const city = address_components.find(({types}) => types.includes('locality')) || {}
  const country = address_components.find(({types}) => types.includes('country')) || {}
  return {
    cityLong: city.long_name,
    cityShort: city.short_name,
    countryLong: country.long_name,
    countryShort: country.short_name
  }
}

const plugin = ({term, display, config, actions}) => {
  const locale = 'ru-RU'//config.get('locale')
  const lang = config.get('lang')
  const match = term.match(/(?:time|время)\s(?:in|в\s)?(.+)/)
  if (match) {
    geocode(match[1], lang).then(({address_components, geometry}) => {
      if (!geometry) return
      const { cityLong, countryLong, countryShort } = parseAddress(address_components)
      getTimezone(formatLocation(geometry.location)).then(tz => {
        const { timeZoneName, timeZoneId: timeZone, rawOffset } = tz
        const now = new Date()
        const time = now.toLocaleTimeString(locale, { timeZone }).replace(/:\d{2}(:?\s|$)/, '')
        const date = now.toLocaleDateString(locale, { timeZone })
        const offset = `UTC +${rawOffset / 3600}`
        display({
          title: `${cityLong || countryLong}: ${time}`,
          subtitle: `${date} · ${countryLong} · ${tz.timeZoneName} (${offset})`,
          icon: path.join(__dirname, 'flags', `${countryShort}.png`)
        })
      })
    })
  }
};

module.exports = {
  fn: plugin,
  name: 'Get time in...',
  keyword: 'time'
}
