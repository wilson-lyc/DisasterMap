import request from './index'

export function getDisasterData(filter = {}) {
    return request.post('/getDisasterData', filter)
}