import request from '@/utils/request'

// 查询发运单列表
export function listLoading(query) {
  return request({
    url: '/warehouse/billOfLoading/list',
    method: 'get',
    params: query
  })
}

// 查询发运单详细
export function getLoading(id) {
  return request({
    url: '/warehouse/billOfLoading/' + id,
    method: 'get'
  })
}

// 新增发运单
export function addLoading(data) {
  return request({
    url: '/warehouse/billOfLoading',
    method: 'post',
    data: data
  })
}

// 修改发运单
export function updateLoading(data) {
  return request({
    url: '/warehouse/billOfLoading',
    method: 'put',
    data: data
  })
}

// 删除发运单
export function delLoading(id) {
  return request({
    url: '/warehouse/billOfLoading/' + id,
    method: 'delete'
  })
}

// 发运完成
export function finish(data) {
  return request({
    url: "/warehouse/billOfLoading/finish",
    method: "put",
    data: data
  });
}