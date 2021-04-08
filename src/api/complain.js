import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/complain/list',
        method: 'get',
        params: query
    })
}

export function removeComplain(data) {
    return request({
        url: '/complain/remove',
        method: 'delete',
        data
    })
}