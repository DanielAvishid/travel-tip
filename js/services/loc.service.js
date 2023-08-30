// import { storageService } from './async-storage.service'

export const locService = {
  getLocs,
}

const locs = [
  _createLoc('Greatplace', 32.047104, 34.832384, null, null),
  _createLoc('Neveragain', 32.047201, 34.832581, null, null),
]

function _createLoc(locName, lat, lng, weather = null, updatedAt = null) {
  return {
    id: _makeId(),
    locName,
    lat,
    lng,
    weather,
    createdAt: Date.now(),
    updatedAt,
  }
}

function getLocs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(locs)
    }, 2000)
  })
}

function _makeId(length = 5) {
  var txt = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}
