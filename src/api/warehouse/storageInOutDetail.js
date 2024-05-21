import request from '@/utils/request'

// 查询出入库记录详情列表
export function listStorageInOutDetail(query) {
  return request({
    url: '/warehouse/storageInOutDetail/list',
    method: 'get',
    params: query
  })
}

// 查询出入库记录详情详细
export function getStorageInOutDetail(id) {
  return request({
    url: '/warehouse/storageInOutDetail/' + id,
    method: 'get'
  })
}

// 新增出入库记录详情
export function addStorageInOutDetail(data) {
  return request({
    url: '/warehouse/storageInOutDetail',
    method: 'post',
    data: data
  })
}

// 修改出入库记录详情
export function updateStorageInOutDetail(data) {
  return request({
    url: '/warehouse/storageInOutDetail',
    method: 'put',
    data: data
  })
}

// 删除出入库记录详情
export function delStorageInOutDetail(id) {
  return request({
    url: '/warehouse/storageInOutDetail/' + id,
    method: 'delete'
  })
}
