import request from "@/utils/request";

// 查询作业通知明细分配列表
export function listWorkNoticeAllot(query) {
  return request({
    url: "/warehouse/workNoticeAllot/list",
    method: "get",
    params: query,
  });
}

// 查询作业通知明细分配详细
export function getWorkNoticeAllot(id) {
  return request({
    url: "/warehouse/workNoticeAllot/" + id,
    method: "get",
  });
}

// 新增作业通知明细分配
export function addWorkNoticeAllot(data) {
  return request({
    url: "/warehouse/workNoticeAllot",
    method: "post",
    data: data,
  });
}

// 修改作业通知明细分配
export function updateWorkNoticeAllot(data) {
  return request({
    url: "/warehouse/workNoticeAllot",
    method: "put",
    data: data,
  });
}

// 删除作业通知明细分配
export function delWorkNoticeAllot(id) {
  return request({
    url: "/warehouse/workNoticeAllot/" + id,
    method: "delete",
  });
}


// 退货确认
export function refundConfirm(id) { 
  return request({
    url: "/warehouse/workNoticeAllot/refundConfirm/"+id,
    method: "put",
  });
}


// 批量取消
export function cancelAll(id) {
  return request({
    url: "/warehouse/workNoticeAllot/cancel/" + id,
    method: "put",
  });
}

// 提交批量入库
export function submitAllot(data) {
  return request({
    url: "/warehouse/workNoticeAllot/submitAllot",
    method: "put",
    data: data,
  });
}
