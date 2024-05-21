import request from "@/utils/request";

// 查询出库确认项列表
export function listDeliverySureDict(query) {
  return request({
    url: "/system/deliverySureDict/list",
    method: "get",
    params: query,
  });
}

// 查询出库确认项详细
export function getDeliverySureDict(id) {
  return request({
    url: "/system/deliverySureDict/" + id,
    method: "get",
  });
}

// 新增出库确认项
export function addDeliverySureDict(data) {
  return request({
    url: "/system/deliverySureDict",
    method: "post",
    data: data,
  });
}

// 修改出库确认项
export function updateDeliverySureDict(data) {
  return request({
    url: "/system/deliverySureDict",
    method: "put",
    data: data,
  });
}

// 删除出库确认项
export function delDeliverySureDict(id) {
  return request({
    url: "/system/deliverySureDict/" + id,
    method: "delete",
  });
}

// 获取出库确认项
export function getSureDictList(query) {
  return request({
    url: "/system/deliverySureDict/getListByBusinessType",
    method: "get",
    params: query,
  });
}

// 查询出库确认信息
export function getDeliverySureInfo(id) {
  return request({
    url: "/system/deliverySure/getDeliverySureInfo/" + id,
    method: "get",
  });
}
