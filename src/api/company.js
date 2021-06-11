import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/company/list',
        method: 'get',
        params: query
    })
}

export function createCompany(data) {
    return request({
        url: '/company/add',
        method: 'post',
        data
    })
}


export function updateCompany(data) {
    return request({
        url: '/company/update',
        method: 'put',
        data
    })
}

export function emptyLinkPics(data) {
    return request({
        url: '/company/emptypics',
        method: 'put',
        data
    })
}

export function removeCompany(data) {
    return request({
        url: '/company/remove',
        method: 'delete',
        data
    })
}