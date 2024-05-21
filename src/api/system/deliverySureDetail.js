import request from '@/utils/request'

// 查询出库确认记录详情列表
export function listDeliverySureDetail(query) {
  return request({
    url: '/system/deliverySureDetail/list',
    method: 'get',
    params: query
  })
}

// 查询出库确认记录详情详细
export function getDeliverySureDetail(id) {
  return request({
    url: '/system/deliverySureDetail/' + id,
    method: 'get'
  })
}

// 新增出库确认记录详情
export function addDeliverySureDetail(data) {
  return request({
    url: '/system/deliverySureDetail',
    method: 'post',
    data: data
  })
}

// 修改出库确认记录详情
export function updateDeliverySureDetail(data) {
  return request({
    url: '/system/deliverySureDetail',
    method: 'put',
    data: data
  })
}

// 删除出库确认记录详情
export function delDeliverySureDetail(id) {
  return request({
    url: '/system/deliverySureDetail/' + id,
    method: 'delete'
  })
}
