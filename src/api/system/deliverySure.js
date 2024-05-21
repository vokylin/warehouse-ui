import request from '@/utils/request'

// 查询出库确认记录列表
export function listDeliverySure(query) {
  return request({
    url: '/system/deliverySure/list',
    method: 'get',
    params: query
  })
}

// 查询出库确认记录详细
export function getDeliverySure(id) {
  return request({
    url: '/system/deliverySure/' + id,
    method: 'get'
  })
}

// 新增出库确认记录
export function addDeliverySure(data) {
  return request({
    url: '/system/deliverySure',
    method: 'post',
    data: data
  })
}

// 修改出库确认记录
export function updateDeliverySure(data) {
  return request({
    url: '/system/deliverySure',
    method: 'put',
    data: data
  })
}

// 删除出库确认记录
export function delDeliverySure(id) {
  return request({
    url: '/system/deliverySure/' + id,
    method: 'delete'
  })
}
