import request from '@/utils/request'

// 查询存储单元列表
export function listStorageUnit(query) {
  return request({
    url: '/system/storageUnit/list',
    method: 'get',
    params: query
  })
}

// 查询存储单元详细
export function getStorageUnit(id) {
  return request({
    url: '/system/storageUnit/' + id,
    method: 'get'
  })
}

// 新增存储单元
export function addStorageUnit(data) {
  return request({
    url: '/system/storageUnit',
    method: 'post',
    data: data
  })
}

// 修改存储单元
export function updateStorageUnit(data) {
  return request({
    url: '/system/storageUnit',
    method: 'put',
    data: data
  })
}

// 删除存储单元
export function delStorageUnit(id) {
  return request({
    url: '/system/storageUnit/' + id,
    method: 'delete'
  })
}

// 查询存储单元树
export function treeStorageUnit(query) {
  return request({
    url: "/system/storageUnit/tree",
    method: "get",
    params: query,
  });
}

// 查询最小存储单元
export function listAll(query) {
  return request({
    url: "/system/storageUnit/listAll",
    method: "get",
    params: query,
  });
}

