import request from '@/utils/request'

// 查询出入库记录列表
export function listStorageInOutRecord(query) {
  return request({
    url: '/warehouse/storageInOutRecord/list',
    method: 'get',
    params: query
  })
}

// 查询出入库记录详细
export function getStorageInOutRecord(id) {
  return request({
    url: '/warehouse/storageInOutRecord/' + id,
    method: 'get'
  })
}

// 新增出入库记录
export function addStorageInOutRecord(data) {
  return request({
    url: '/warehouse/storageInOutRecord',
    method: 'post',
    data: data
  })
}

// 修改出入库记录
export function updateStorageInOutRecord(data) {
  return request({
    url: '/warehouse/storageInOutRecord',
    method: 'put',
    data: data
  })
}

// 删除出入库记录
export function delStorageInOutRecord(id) {
  return request({
    url: '/warehouse/storageInOutRecord/' + id,
    method: 'delete'
  })
}

// 修改备注
export function updateRemark(data) {
  return request({
    url: '/warehouse/storageInOutRecord/remark',
    method: 'put',
    data: data
  })
}
