import request from "@/utils/request";

// 查询作业通知列表
export function listWorkNotice(query) {
  return request({
    url: "/warehouse/workNotice/list",
    method: "get",
    params: query,
  });
}

// 查询作业通知详细
export function getWorkNotice(id) {
  return request({
    url: "/warehouse/workNotice/" + id,
    method: "get",
  });
}

// 新增作业通知
export function addWorkNotice(data) {
  return request({
    url: "/warehouse/workNotice",
    method: "post",
    data: data,
  });
}

// 修改作业通知
export function updateWorkNotice(data) {
  return request({
    url: "/warehouse/workNotice",
    method: "put",
    data: data,
  });
}

// 删除作业通知
export function delWorkNotice(id) {
  return request({
    url: "/warehouse/workNotice/" + id,
    method: "delete",
  });
}

// 作业完成
export function completeWork(data) {
  return request({
    url: "/warehouse/workNotice/completeWork",
    method: "put",
    data: data,
  });
}

// 作业取消
export function cancelWork(data) {
  return request({
    url: "/warehouse/workNotice/cancelWork",
    method: "put",
    data: data,
  });
}

// 登记完成
export function registerComplete(data) {
  return request({
    url: "/warehouse/workNotice/registerComplete",
    method: "put",
    data: data,
  });
}

// 退货完成
export function returnComplete(data) {
  return request({
    url: "/warehouse/workNotice/returnComplete",
    method: "put",
    data: data,
  });
}

// 整单完成
export function wholeWork(data) {
  return request({
    url: "/warehouse/workNotice/wholeWork",
    method: "put",
    data: data,
  });
}
