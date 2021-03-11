import request from '@/utils/request'

// export function login(data) {
//   return request({
//     url: '/vue-admin-template/user/login',
//     method: 'post',
//     data
//   })
// }

export function login(data) {
    return request({
        url: '/admin/login',
        method: 'post',
        data
    })
}

export function getInfo(token) {
    return request({
        url: '/admin/info',
        method: 'get',
        params: { token }
    })
}

export function logout() {
    return request({
        url: '/admin/logout',
        method: 'post'
    })
}

export function fetchList(query) {
    return request({
        url: '/user/list',
        method: 'get',
        params: query
    })
}

export function updateUser(data) {
    return request({
        url: '/user/update',
        method: 'put',
        data
    })
}

export function removeUser(data) {
    return request({
        url: '/user/remove',
        method: 'delete',
        data
    })
}


export function levelUp(data) {
    return request({
        url: '/group/add',
        method: 'post',
        data
    })
}

export function isCap(id) { //传入用户的id号
    return request({
        url: '/group/iscap',
        method: 'get',
        params: { id }
    })
}