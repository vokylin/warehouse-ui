import request from '@/utils/request'

// 查询物料主档列表
export function listProductInfo(query) {
  return request({
    url: '/system/productInfo/list',
    method: 'get',
    params: query
  })
}

// 查询物料主档详细
export function getProductInfo(id) {
  return request({
    url: '/system/productInfo/' + id,
    method: 'get'
  })
}

// 新增物料主档
export function addProductInfo(data) {
  return request({
    url: '/system/productInfo',
    method: 'post',
    data: data
  })
}

// 修改物料主档
export function updateProductInfo(data) {
  return request({
    url: '/system/productInfo',
    method: 'put',
    data: data
  })
}

// 删除物料主档
export function delProductInfo(id) {
  return request({
    url: '/system/productInfo/' + id,
    method: 'delete'
  })
}
