import { storageService } from './async-storage.service.js'
import { controller } from '../app.controller.js'

export const mapService = {
  initMap,
  addMarker,
  panTo,
  getLocationPos
}

// Var that is used throughout this Module (not global)
const LOCATION_KEY = 'locationsDB'
var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
  console.log('InitMap')
  return _connectGoogleApi()
    .then(() => {
      console.log('google available')
      gMap = new google.maps.Map(
        document.querySelector('#map'), {
        center: { lat, lng },
        zoom: 15
      })
      gMap.addListener('click', ev => {
        const locName = prompt('Enter location name:')
        if (!locName) return
        const lat = ev.latLng.lat()
        const lng = ev.latLng.lng()
        const newLocation = { locName, lat, lng }
        storageService.post(LOCATION_KEY, newLocation)
          .then(controller.renderLocations)
      })
    })
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: 'Hello World!',
  })
  return marker
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng)
  gMap.panTo(laLatLng)
}

function getLocationPos(location) {
  const API_KEY = 'AIzaSyB93A3_Tv7Mapir6BN4Q7KmvftyKPUzPLc'
  return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      return data.results[0].geometry.location
    })
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve()
  const API_KEY = 'AIzaSyAmZRZ5mTMW_T3C80vuxvULrNhuUftEzoc'
  var elGoogleApi = document.createElement('script')
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
  elGoogleApi.async = true
  document.body.append(elGoogleApi)

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve
    elGoogleApi.onerror = () => reject('Google script failed to load')
  })
}


