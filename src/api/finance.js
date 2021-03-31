import request from '@/utils/request'

export function linkChartData() {
    return request({
        url: '/finance/linkschart',
        method: 'get',
    })
}

export function companyChartData() {
    return request({
        url: '/finance/companychart',
        method: 'get',
    })
}

export function courseChartData() {
    return request({
        url: '/finance/coursechart',
        method: 'get',
    })
}