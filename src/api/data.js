import request from './index'

export function getData(filter = {}) {
    return request.get('/getData', { params: filter })
}