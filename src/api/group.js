import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/group/list',
        method: 'get',
        params: query
    })
}

export function removeGroup(data) {
    return request({
        url: '/group/remove',
        method: 'delete',
        data
    })
}

export function addGroup(data) {
    return request({
        url: '/group/add',
        method: 'post',
        data
    })
}

export function updateGroupCapid(data) {
    return request({
        url: '/group/updatecapid',
        method: 'put',
        data
    })
}

export function joinGroup(data) {
    return request({
        url: '/group/joingroup',
        method: 'put',
        data
    })
}

export function openGroup(data) {
    return request({
        url: '/group/opengroup',
        method: 'post',
        data
    })
}