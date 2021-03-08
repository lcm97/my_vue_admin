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