import { memoize } from 'cerebro-tools'

const geocode = (term, userLang) => {
  const url = `http://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(term)}&language=${userLang}`
  return fetch(url)
    .then(response => response.json())
    .then(json => json.results[0] || {})
}

module.exports = memoize(geocode)
