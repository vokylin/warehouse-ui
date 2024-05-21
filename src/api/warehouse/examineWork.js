import request from "@/utils/request";

// 查询质检作业列表
export function listExamineWork(query) {
  return request({
    url: "/warehouse/examineWork/list",
    method: "get",
    params: query,
  });
}

// 查询质检作业详细
export function getExamineWork(id) {
  return request({
    url: "/warehouse/examineWork/" + id,
    method: "get",
  });
}

// 新增质检作业
export function addExamineWork(data) {
  return request({
    url: "/warehouse/examineWork",
    method: "post",
    data: data,
  });
}

// 修改质检作业
export function updateExamineWork(data) {
  return request({
    url: "/warehouse/examineWork",
    method: "put",
    data: data,
  });
}

// 删除质检作业
export function delExamineWork(id) {
  return request({
    url: "/warehouse/examineWork/" + id,
    method: "delete",
  });
}

// 通知质检
export function noticeExamineWork(data) {
  return request({
    url: "/warehouse/examineWork/notice",
    method: "put",
    data: data,
  });
}

// 退货
export function refund(data) {
  return request({
    url: "/warehouse/examineWork/refund",
    method: "put",
    data: data,
  });
}

// 上架作业
export function shelves(data) {
  return request({
    url: "/warehouse/examineWork/shelves",
    method: "put",
    data: data,
  });
}
