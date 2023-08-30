import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { storageService } from './services/async-storage.service.js'

export const controller = {
  renderLocations
}

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onDeleteLoc = onDeleteLoc
window.onGoTo = onGoTo
window.onSearchLocation = onSearchLocation

const LOCATION_KEY = 'locationsDB'

function onInit() {
  mapService
    .initMap()
    .then(() => {
      renderLocations()
      console.log('Map is ready')
    })
    .catch(() => console.log('Error: cannot init map'))
}

function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

function onAddMarker() {
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
  locService.getLocs().then(locs => {
    console.log('Locations:', locs)
    document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
  })
}

function onGetUserPos() {
  getPosition()
    .then(pos => {
      mapService.panTo(pos.coords.latitude, pos.coords.longitude)
      document.querySelector(
        '.location-name'
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
    })
    .catch(err => {
      console.log('err!!!', err)
    })
}

function onSearchLocation(location) {
  mapService.getLocationPos(location)
    .then(pos => {
      const { lat, lng } = pos
      const locName = location
      mapService.panTo(lat, lng)
      const newLocation = { locName, lat, lng }
      console.log(newLocation)
      storageService.post(LOCATION_KEY, newLocation)
        .then(controller.renderLocations)
    })
}

function onPanTo() {
  console.log('Panning the Map')
  mapService.panTo(35.6895, 139.6917)
  document.querySelector('.location-name').innerText = 'Tokyo'
}

function onDeleteLoc(locationId) {
  storageService.remove(LOCATION_KEY, locationId)
    .then(renderLocations)
}

function onGoTo(locationId) {
  storageService.get(LOCATION_KEY, locationId)
    .then(location => {
      mapService.panTo(location.lat, location.lng)
      document.querySelector('.location-name').innerText = location.locName
    })
}

// Render Functions //
function renderLocations() {
  const locationsDB = storageService.query(LOCATION_KEY).then(locations => {
    const strHtMLs = locations.map(location => {
      return `
      <div class="location-container flex space-between align-center gap">
            <span>${location.locName}</span>
            <div class="buttons-container flex">
            <button class="loc-table-btn" onclick="onGoTo('${location.id}')">GO</button>
            <button class="loc-table-btn" onclick="onDeleteLoc('${location.id}')">x</button>
            </div>
      </div>`
    })
    document.querySelector('.locs').innerHTML = strHtMLs.join('')
  })
}
