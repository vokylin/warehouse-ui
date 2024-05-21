import request from '@/utils/request'

// 查询出库通知明细列表
export function listDeliveryNoticeDetail(query) {
  return request({
    url: '/warehouse/deliveryNoticeDetail/list',
    method: 'get',
    params: query
  })
}

// 查询出库通知明细详细
export function getDeliveryNoticeDetail(id) {
  return request({
    url: '/warehouse/deliveryNoticeDetail/' + id,
    method: 'get'
  })
}

// 新增出库通知明细
export function addDeliveryNoticeDetail(data) {
  return request({
    url: '/warehouse/deliveryNoticeDetail',
    method: 'post',
    data: data
  })
}

// 修改出库通知明细
export function updateDeliveryNoticeDetail(data) {
  return request({
    url: '/warehouse/deliveryNoticeDetail',
    method: 'put',
    data: data
  })
}

// 删除出库通知明细
export function delDeliveryNoticeDetail(id) {
  return request({
    url: '/warehouse/deliveryNoticeDetail/' + id,
    method: 'delete'
  })
}

// 批量取消分配库存
export function cancelAllot(ids) {
  return request({
    url: '/warehouse/deliveryNoticeDetail/cancelAllot/' + ids,
    method: 'put',
  })
}
