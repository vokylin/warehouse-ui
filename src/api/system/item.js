import request from '@/utils/request'

// 查询物料列表
export function listItem(query) {
  return request({
    url: '/system/item/list',
    method: 'get',
    params: query
  })
}

// 查询物料详细
export function getItem(id) {
  return request({
    url: "/system/item/" + id,
    method: "get",
  });
}

// 新增物料
export function addItem(data) {
  return request({
    url: "/system/item",
    method: "post",
    data: data,
  });
}

// 修改物料
export function updateItem(data) {
  return request({
    url: "/system/item",
    method: "put",
    data: data,
  });
}

// 删除物料
export function delItem(id) {
  return request({
    url: "/system/item/" + id,
    method: "delete",
  });
}
