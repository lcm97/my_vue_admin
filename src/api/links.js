import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/links/list',
        method: 'get',
        params: query
    })
}
//根据id获取单条记录
export function fetchLink(id) {
    return request({
        url: '/links/info',
        method: 'get',
        params: { id }
    })
}

export function createLink(data) {
    return request({
        url: '/links/add',
        method: 'post',
        data
    })
}

export function updateLink(data) {
    return request({
        url: '/links/update',
        method: 'put',
        data
    })
}

export function removeLink(data) {
    return request({
        url: '/links/remove',
        method: 'delete',
        data
    })
}