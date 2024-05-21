import request from "@/utils/request";

// 查询入库通知列表
export function listWmsReceiveNotice(query) {
  return request({
    url: "/warehouse/wmsReceiveNotice/list",
    method: "get",
    params: query,
  });
}

// 查询入库通知详细
export function getWmsReceiveNotice(id) {
  return request({
    url: "/warehouse/wmsReceiveNotice/" + id,
    method: "get",
  });
}

// 新增入库通知
export function addWmsReceiveNotice(data) {
  return request({
    url: "/warehouse/wmsReceiveNotice",
    method: "post",
    data: data,
  });
}

// 修改入库通知
export function updateWmsReceiveNotice(data) {
  return request({
    url: "/warehouse/wmsReceiveNotice",
    method: "put",
    data: data,
  });
}

// 删除入库通知
export function delWmsReceiveNotice(id) {
  return request({
    url: "/warehouse/wmsReceiveNotice/" + id,
    method: "delete",
  });
}

// 激活入库通知
export function activeWmsReceiveNotice(data) {
  return request({
    url: "/warehouse/wmsReceiveNotice/active",
    method: "put",
    data: data,
  });
}

// 反激活入库通知
export function inactiveWmsReceiveNotice(ids) {
  return request({
    url: "/warehouse/wmsReceiveNotice/inactive",
    method: "put",
    data: ids,
  });
}

// 收货确认
export function receiveConfirm(id) {
  return request({
    url: "/warehouse/wmsReceiveNotice/confirm",
    method: "put",
    data: id,
  });
}

// 作废通知
export function invalidNotice(data) {
  return request({
    url: "/warehouse/wmsReceiveNotice/invalid",
    method: "put",
    data: data,
  });
}

// 最近的月结月份
export function getCheckOutMonth() {
  return request({
    url: "/warehouse/monthCheckOut/getCheckOutMonth",
    method: "get"
  });
}
