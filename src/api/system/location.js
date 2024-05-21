import request from '@/utils/request'

// 查询库位列表
export function listLocation(query) {
  return request({
    url: '/system/location/list',
    method: 'get',
    params: query
  })
}

// 查询库位详细
export function getLocation(id) {
  return request({
    url: '/system/location/' + id,
    method: 'get'
  })
}

// 新增库位
export function addLocation(data) {
  return request({
    url: '/system/location',
    method: 'post',
    data: data
  })
}

// 修改库位
export function updateLocation(data) {
  return request({
    url: '/system/location',
    method: 'put',
    data: data
  })
}

// 删除库位
export function delLocation(id) {
  return request({
    url: '/system/location/' + id,
    method: 'delete'
  })
}
