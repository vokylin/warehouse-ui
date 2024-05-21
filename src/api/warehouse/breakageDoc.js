import request from "@/utils/request";

// 查询报损单列表
export function listBreakageDoc(query) {
  return request({
    url: "/warehouse/breakageDoc/list",
    method: "get",
    params: query,
  });
}

// 查询报损单详细
export function getBreakageDoc(id) {
  return request({
    url: "/warehouse/breakageDoc/" + id,
    method: "get",
  });
}

// 新增报损单
export function addBreakageDoc(data) {
  return request({
    url: "/warehouse/breakageDoc",
    method: "post",
    data: data,
  });
}

// 修改报损单
export function updateBreakageDoc(data) {
  return request({
    url: "/warehouse/breakageDoc",
    method: "put",
    data: data,
  });
}

// 删除报损单
export function delBreakageDoc(id) {
  return request({
    url: "/warehouse/breakageDoc/" + id,
    method: "delete",
  });
}

// 提交报损单
export function commitBreakageDoc(id) {
  return request({
    url: "/warehouse/breakageDoc/submit/" + id,
    method: "put",
  });
}


// 查询报损物料明细列表
export function listBreakageDocDetail(query) {
  return request({
    url: "/warehouse/breakageDocDetail/list",
    method: "get",
    params: query,
  });
}

// 查询报损物料明细详细
export function getBreakageDocDetail(id) {
  return request({
    url: "/warehouse/breakageDocDetail/" + id,
    method: "get",
  });
}

// 新增报损物料明细
export function addBreakageDocDetail(data) {
  return request({
    url: "/warehouse/breakageDocDetail",
    method: "post",
    data: data,
  });
}

// 修改报损物料明细
export function updateBreakageDocDetail(data) {
  return request({
    url: "/warehouse/breakageDocDetail",
    method: "put",
    data: data,
  });
}

// 删除报损物料明细
export function delBreakageDocDetail(id) {
  return request({
    url: "/warehouse/breakageDocDetail/" + id,
    method: "delete",
  });
}

// 批量分配
export function allotBatch(data) {
  return request({
    url: "/warehouse/breakageDocDetail/allotBatch",
    method: "put",
    data: data,
  });
}

// 批量取消
export function cancelBatch(data) {
  return request({
    url: "/warehouse/breakageDocDetail/cancelBatch",
    method: "put",
    data: data,
  });
}

// 审核通过
export function auditPass(id) {
  return request({
    url: "/warehouse/breakageDoc/approved/" + id,
    method: "put",
  });
}
