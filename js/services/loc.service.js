export const locService = {
    getLocs
}

var gNextId = 1
const STORAGE_KEY = 'locationsDB'

const locs = [
    _createLoc('Greatplace', 32.047104, 34.832384, null, null),
    _createLoc('Neveragain', 32.047201, 34.832581, null, null)
]

function _createLoc(locName, lat, lng, weather, updatedAt) {
    return {
        id: gNextId++,
        locName,
        lat,
        lng,
        weather,
        createdAt: Date.now(),
        updatedAt
    }
}

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}