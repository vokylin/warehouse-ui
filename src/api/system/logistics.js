import request from '@/utils/request'

// 查询承运商列表
export function listLogistics(query) {
  return request({
    url: '/system/logistics/list',
    method: 'get',
    params: query
  })
}

// 查询承运商详细
export function getLogistics(id) {
  return request({
    url: '/system/logistics/' + id,
    method: 'get'
  })
}

// 新增承运商
export function addLogistics(data) {
  return request({
    url: '/system/logistics',
    method: 'post',
    data: data
  })
}

// 修改承运商
export function updateLogistics(data) {
  return request({
    url: '/system/logistics',
    method: 'put',
    data: data
  })
}

// 删除承运商
export function delLogistics(id) {
  return request({
    url: '/system/logistics/' + id,
    method: 'delete'
  })
}
