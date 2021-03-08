import request from '@/utils/request'

export function deleteFile(filename) {
    return request({
        url: '/remove',
        method: 'delete',
        params: { filename }
    })
}


export function fetchLinkList() {
    return request({
        url: '/links/findall',
        method: 'get',
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