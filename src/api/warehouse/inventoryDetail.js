import request from '@/utils/request'

// 查询盘点详情列表
export function listInventoryDetail(query) {
  return request({
    url: '/warehouse/inventoryDetail/list',
    method: 'get',
    params: query
  })
}

// 查询盘点详情详细
export function getInventoryDetail(id) {
  return request({
    url: '/warehouse/inventoryDetail/' + id,
    method: 'get'
  })
}

// 新增盘点详情
export function addInventoryDetail(data) {
  return request({
    url: '/warehouse/inventoryDetail',
    method: 'post',
    data: data
  })
}

// 修改盘点详情
export function updateInventoryDetail(data) {
  return request({
    url: '/warehouse/inventoryDetail',
    method: 'put',
    data: data
  })
}

// 批量修改
export function updateInventoryDetailBatch(data) {
  return request({
    url: '/warehouse/inventoryDetail/batchEdit',
    method: 'put',
    data: data
  })
}

// 删除盘点详情
export function delInventoryDetail(id) {
  return request({
    url: '/warehouse/inventoryDetail/' + id,
    method: 'delete'
  })
}
