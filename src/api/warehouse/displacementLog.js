import request from '@/utils/request'

// 查询移位日志列表
export function listDisplacementLog(query) {
  return request({
    url: '/warehouse/displacementLog/list',
    method: 'get',
    params: query
  })
}

// 查询移位日志详细
export function getDisplacementLog(id) {
  return request({
    url: '/warehouse/displacementLog/' + id,
    method: 'get'
  })
}

// 新增移位日志
export function addDisplacementLog(data) {
  return request({
    url: '/warehouse/displacementLog',
    method: 'post',
    data: data
  })
}

// 修改移位日志
export function updateDisplacementLog(data) {
  return request({
    url: '/warehouse/displacementLog',
    method: 'put',
    data: data
  })
}

// 删除移位日志
export function delDisplacementLog(id) {
  return request({
    url: '/warehouse/displacementLog/' + id,
    method: 'delete'
  })
}
