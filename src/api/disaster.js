import request from './index'

export function getMapData(filter = {}) {
    return request.post('/getMapData', filter)
}

export function getDisasterDetail(id){
    return request.get('/getDisasterDetail', { params: { id } })
}