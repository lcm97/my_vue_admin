import request from '@/utils/request'

export function deleteFile(filename) {
    return request({
        url: '/remove',
        method: 'delete',
        params: { filename }
    })
}