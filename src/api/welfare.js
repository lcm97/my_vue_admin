import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/welfare/list',
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

export function createWelfare(data) {
    return request({
        url: '/welfare/add',
        method: 'post',
        data
    })
}

export function updateWelfare(data) {
    return request({
        url: '/welfare/update',
        method: 'put',
        data
    })
}

export function emptyLinkPics(data) {
    return request({
        url: '/welfare/emptypics',
        method: 'put',
        data
    })
}

export function removeWelfare(data) {
    return request({
        url: '/welfare/remove',
        method: 'delete',
        data
    })
}