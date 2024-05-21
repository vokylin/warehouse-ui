import request from '@/utils/request'

// 查询出入库记录列表
export function listStorageInOutLog(query) {
  return request({
    url: '/warehouse/storageInOutLog/list',
    method: 'get',
    params: query
  })
}

// 查询出入库记录详细
export function getStorageInOutLog(id) {
  return request({
    url: '/warehouse/storageInOutLog/' + id,
    method: 'get'
  })
}

// 新增出入库记录
export function addStorageInOutLog(data) {
  return request({
    url: '/warehouse/storageInOutLog',
    method: 'post',
    data: data
  })
}

// 修改出入库记录
export function updateStorageInOutLog(data) {
  return request({
    url: '/warehouse/storageInOutLog',
    method: 'put',
    data: data
  })
}

// 删除出入库记录
export function delStorageInOutLog(id) {
  return request({
    url: '/warehouse/storageInOutLog/' + id,
    method: 'delete'
  })
}
