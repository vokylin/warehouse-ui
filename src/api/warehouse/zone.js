import request from '@/utils/request'

// 查询库区列表
export function listZone(query) {
  return request({
    url: '/warehouse/zone/list',
    method: 'get',
    params: query
  })
}

// 查询库区详细
export function getZone(id) {
  return request({
    url: '/warehouse/zone/' + id,
    method: 'get'
  })
}

// 新增库区
export function addZone(data) {
  return request({
    url: '/warehouse/zone',
    method: 'post',
    data: data
  })
}

// 修改库区
export function updateZone(data) {
  return request({
    url: '/warehouse/zone',
    method: 'put',
    data: data
  })
}

// 删除库区
export function delZone(id) {
  return request({
    url: '/warehouse/zone/' + id,
    method: 'delete'
  })
}
