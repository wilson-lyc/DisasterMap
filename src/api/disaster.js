import request from './index'

export function getDisasterData(filter = {}) {
    return request.post('/getDisasterData', filter)
}

export function getDisasterDetail(id){
    return request.get('/getDisasterDetail', { params: { id } })
}