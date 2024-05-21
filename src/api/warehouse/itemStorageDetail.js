import request from "@/utils/request";

// 查询库存详情列表
export function listItemStorageDetail(query) {
  return request({
    url: "/warehouse/itemStorageDetail/list",
    method: "get",
    params: query,
  });
}

// 查询出库通知明细列表
export function listItemStorageDetailByUser(query) {
  return request({
    url: "/warehouse/itemStorageDetail/listByUser",
    method: "get",
    params: query,
  });
}

// 查询报损物料列表
export function breakageList(query) {
  return request({
    url: "/warehouse/itemStorageDetail/breakageList",
    method: "get",
    params: query,
  });
}

// 查询库存详情详细
export function getItemStorageDetail(id) {
  return request({
    url: "/warehouse/itemStorageDetail/" + id,
    method: "get",
  });
}

// 新增库存详情
export function addItemStorageDetail(data) {
  return request({
    url: "/warehouse/itemStorageDetail",
    method: "post",
    data: data,
  });
}

// 修改库存详情
export function updateItemStorageDetail(data) {
  return request({
    url: "/warehouse/itemStorageDetail",
    method: "put",
    data: data,
  });
}

// 删除库存详情
export function delItemStorageDetail(id) {
  return request({
    url: "/warehouse/itemStorageDetail/" + id,
    method: "delete",
  });
}

// 分配库存
export function allotItemStorageDetail(data) {
  return request({
    url: "/warehouse/itemStorageDetail/allot",
    method: "put",
    data: data,
  });
}

// 批量分配库存
export function allotItemStorageDetailBatch(data) {
  return request({
    url: "/warehouse/itemStorageDetail/allotBatch",
    method: "put",
    data: data,
  });
}

// 取消分配库存
export function cancelAllotItemStorageDetail(data) {
  return request({
    url: "/warehouse/itemStorageDetail/cancelAllot",
    method: "put",
    data: data,
  });
}

// 批量取消分配库存
export function cancelAllotItemStorageDetailBatch(data) {
  return request({
    url: "/warehouse/itemStorageDetail/cancelAllotBatch",
    method: "put",
    data: data,
  });
}

// 移位
export function moveItemStorageDetail(data) {
  return request({
    url: "/warehouse/itemStorageDetail/displacement",
    method: "put",
    data: data,
  });
}

// 调拨
export function transferItemStorageDetail(data) {
  return request({
    url: "/warehouse/itemStorageDetail/allocate",
    method: "put",
    data: data,
  });
}

// 临期预警列表
export function selectStorageAlertList(query) {
  return request({
    url: "/warehouse/itemStorageDetail/alertList",
    method: "get",
    params: query,
  });
}
