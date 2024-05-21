import request from "@/utils/request";

// 查询入库通知明细列表
export function listWmsReceiveNoticeDetail(query) {
  return request({
    url: "/warehouse/wmsReceiveNoticeDetail/list",
    method: "get",
    params: query,
  });
}

// 查询入库通知明细详细
export function getWmsReceiveNoticeDetail(id) {
  return request({
    url: "/warehouse/wmsReceiveNoticeDetail/" + id,
    method: "get",
  });
}

// 新增入库通知明细
export function addWmsReceiveNoticeDetail(data) {
  return request({
    url: "/warehouse/wmsReceiveNoticeDetail",
    method: "post",
    data: data,
  });
}

// 修改入库通知明细
export function updateWmsReceiveNoticeDetail(data) {
  return request({
    url: "/warehouse/wmsReceiveNoticeDetail",
    method: "put",
    data: data,
  });
}

// 删除入库通知明细
export function delWmsReceiveNoticeDetail(id) {
  return request({
    url: "/warehouse/wmsReceiveNoticeDetail/" + id,
    method: "delete",
  });
}

// 收货
export function allot(data) {
  return request({
    url: "/warehouse/wmsReceiveNoticeDetail/allot",
    method: "put",
    data: data,
  });
}


// 分配
export function receipt(data) {
  return request({
    url: "/warehouse/wmsReceiveNoticeDetail/receipt",
    method: "put",
    data: data,
  });
}

// 退货
export function returnItem(data) {
  return request({
    url: "/warehouse/wmsReceiveNoticeDetail/returnItem",
    method: "put",
    data: data,
  });
}


// 收货
export function batchAllot(data) {
  return request({
    url: "/warehouse/wmsReceiveNoticeDetail/batchAllot",
    method: "put",
    data: data,
  });
}


// 分配
export function batchReceipt(data) {
  return request({
    url: "/warehouse/wmsReceiveNoticeDetail/batchReceipt",
    method: "put",
    data: data,
  });
}
