import request from '@/utils/request'

// 查询剂量单位列表
export function listDoseUnit(query) {
  return request({
    url: '/system/doseUnit/list',
    method: 'get',
    params: query
  })
}

// 查询剂量单位详细
export function getDoseUnit(id) {
  return request({
    url: '/system/doseUnit/' + id,
    method: 'get'
  })
}

// 新增剂量单位
export function addDoseUnit(data) {
  return request({
    url: '/system/doseUnit',
    method: 'post',
    data: data
  })
}

// 修改剂量单位
export function updateDoseUnit(data) {
  return request({
    url: '/system/doseUnit',
    method: 'put',
    data: data
  })
}

// 删除剂量单位
export function delDoseUnit(id) {
  return request({
    url: '/system/doseUnit/' + id,
    method: 'delete'
  })
}
