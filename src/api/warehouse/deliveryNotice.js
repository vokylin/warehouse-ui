import request from "@/utils/request";

// 查询出库通知列表
export function listDeliveryNotice(query) {
  return request({
    url: "/warehouse/deliveryNotice/list",
    method: "get",
    params: query,
  });
}

// 查询出库通知详细
export function getDeliveryNotice(id) {
  return request({
    url: "/warehouse/deliveryNotice/" + id,
    method: "get",
  });
}

// 新增出库通知
export function addDeliveryNotice(data) {
  return request({
    url: "/warehouse/deliveryNotice",
    method: "post",
    data: data,
  });
}

// 修改出库通知
export function updateDeliveryNotice(data) {
  return request({
    url: "/warehouse/deliveryNotice",
    method: "put",
    data: data,
  });
}

// 删除出库通知
export function delDeliveryNotice(id) {
  return request({
    url: "/warehouse/deliveryNotice/" + id,
    method: "delete",
  });
}

// 激活出库通知
export function activeDeliveryNotice(data) {
  return request({
    url: "/warehouse/deliveryNotice/active",
    method: "put",
    data: data,
  });
}

// 反激活出库通知
export function inactiveDeliveryNotice(data) {
  return request({
    url: "/warehouse/deliveryNotice/inactive",
    method: "put",
    data: data,
  });
}

// 作废出库通知
export function cancelDeliveryNotice(data) {
  return request({
    url: "/warehouse/deliveryNotice/invalid",
    method: "put",
    data: data,
  });
}

// 生成拣货作业
export function generatePickWork(data) {
  return request({
    url: "/warehouse/deliveryNotice/pickWork",
    method: "put",
    data: data,
  });
}

// 出库确认
export function deliveryConfirm(data) {
  return request({
    url: "/warehouse/deliveryNotice/deliveryConfirm",
    method: "put",
    data: data,
  });
}

// 出库确认信息
export function deliveryConfirmInfo(id) {
  return request({
    url: "/warehouse/deliveryNotice/deliveryConfirmInfo/" + id,
    method: "get",
  });
}

// 最近的月结月份
export function getCheckOutMonth() {
  return request({
    url: "/warehouse/monthCheckOut/getCheckOutMonth",
    method: "get"
  });
}
