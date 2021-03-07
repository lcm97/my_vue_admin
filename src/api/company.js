import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/company/list',
        method: 'get',
        params: query
    })
}

export function fetchLinkList() {
    return request({
        url: '/links/findall',
        method: 'get',
    })
}

export function createCompany(data) {
    return request({
        url: '/company/add',
        method: 'post',
        data
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



export function updateCompany(data) {
    return request({
        url: '/company/update',
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