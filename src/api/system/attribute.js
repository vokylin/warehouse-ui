import request from '@/utils/request'

// 查询物料仓储属性列表
export function listAttribute(query) {
  return request({
    url: '/system/attribute/list',
    method: 'get',
    params: query
  })
}

// 查询物料仓储属性详细
export function getAttribute(id) {
  return request({
    url: '/system/attribute/' + id,
    method: 'get'
  })
}

// 新增物料仓储属性
export function addAttribute(data) {
  return request({
    url: '/system/attribute',
    method: 'post',
    data: data
  })
}

// 修改物料仓储属性
export function updateAttribute(data) {
  return request({
    url: '/system/attribute',
    method: 'put',
    data: data
  })
}

// 删除物料仓储属性
export function delAttribute(id) {
  return request({
    url: '/system/attribute/' + id,
    method: 'delete'
  })
}
