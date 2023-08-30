import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { storageService } from './services/async-storage.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos

const LOCATION_KEY = 'locationsDB'

function onInit() {
  mapService
    .initMap()
    .then(() => {
      console.log('Map is ready')
    })
    .catch(() => console.log('Error: cannot init map'))
}

function getPosition() {
  console.log('Getting Pos')
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
      console.log('User position is:', pos.coords)
      document.querySelector(
        '.user-pos'
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
    })
    .catch(err => {
      console.log('err!!!', err)
    })
}

function onPanTo() {
  console.log('Panning the Map')
  mapService.panTo(35.6895, 139.6917)
}

// Render Function //
function renderLocations() {
  const locations = storageService.query(LOCATION_KEY).then(locations => {
    const strHtMLs = locations.map(location => {
      return `<div class="flex align-center gap">
            <span>${location.locName}</span>
            <button class="loc-table-btn" onclick="onDeleteLoc(${location.id})">x</button>
        </div>`
    })
    console.log(strHtMLs)
    document.querySelector('.locs').innerHTML = strHtMLs.join('')
  })
}

// Just for tryout
renderLocations()

// delete the location - this func is inside the render div above(x btn) 👆
function onDeleteLoc(id) {
  onDeleteLoc(id)
  renderLocations()
}
