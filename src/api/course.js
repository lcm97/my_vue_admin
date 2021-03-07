import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/course/list',
        method: 'get',
        params: query
    })
}

export function fetchCompanyList() {
    return request({
        url: '/company/findall',
        method: 'get',
    })
}

export function createCourse(data) {
    return request({
        url: '/course/add',
        method: 'post',
        data
    })
}