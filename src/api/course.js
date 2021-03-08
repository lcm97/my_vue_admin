import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/course/list',
        method: 'get',
        params: query
    })
}

export function fetchCompanyList(link_id) {
    return request({
        url: '/company/findall',
        method: 'get',
        params: { link_id }
    })
}

export function fetchCourseList(company) {
    return request({
        url: '/course/findall',
        method: 'get',
        params: { company }
    })
}

export function createCourse(data) {
    return request({
        url: '/course/add',
        method: 'post',
        data
    })
}

export function updateCourse(data) {
    return request({
        url: '/course/update',
        method: 'put',
        data
    })
}

export function removeCourse(data) {
    return request({
        url: '/course/remove',
        method: 'delete',
        data
    })
}

export function refreshCourse(id) {
    return request({
        url: '/course/info',
        method: 'get',
        params: { id }
    })
}

export function draftCourse(id) {
    return request({
        url: '/course/draft',
        method: 'put',
        params: { id }
    })
}

export function publishCourse(id) {
    return request({
        url: '/course/publish',
        method: 'put',
        params: { id }
    })
}