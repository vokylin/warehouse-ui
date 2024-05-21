import request from '@/utils/request'

// 查询存储单元类型列表
export function listStorageUnitType(query) {
  return request({
    url: '/system/storageUnitType/list',
    method: 'get',
    params: query
  })
}

// 查询存储单元类型详细
export function getStorageUnitType(id) {
  return request({
    url: '/system/storageUnitType/' + id,
    method: 'get'
  })
}

// 新增存储单元类型
export function addStorageUnitType(data) {
  return request({
    url: '/system/storageUnitType',
    method: 'post',
    data: data
  })
}

// 修改存储单元类型
export function updateStorageUnitType(data) {
  return request({
    url: '/system/storageUnitType',
    method: 'put',
    data: data
  })
}

// 删除存储单元类型
export function delStorageUnitType(id) {
  return request({
    url: '/system/storageUnitType/' + id,
    method: 'delete'
  })
}


// 查询存储单元树
export function treeStorageUnitType() {
  return request({
    url: "/system/storageUnitType/tree",
    method: "get",
  });
}


// 查询存储单元树
export function storageUnitTypeSelectData() {
  return request({
    url: "/system/storageUnitType/selectData",
    method: "get",
  });
}

