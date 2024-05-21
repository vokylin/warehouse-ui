import request from "@/utils/request";

// 查询入库货物明细列表
export function listWmsReceiveItemDetail(query) {
  return request({
    url: "/warehouse/wmsReceiveItemDetail/list",
    method: "get",
    params: query,
  });
}

// 查询入库货物明细详细
export function getWmsReceiveItemDetail(id) {
  return request({
    url: "/warehouse/wmsReceiveItemDetail/" + id,
    method: "get",
  });
}

// 新增入库货物明细
export function addWmsReceiveItemDetail(data) {
  return request({
    url: "/warehouse/wmsReceiveItemDetail",
    method: "post",
    data: data,
  });
}

// 修改入库货物明细
export function updateWmsReceiveItemDetail(data) {
  return request({
    url: "/warehouse/wmsReceiveItemDetail",
    method: "put",
    data: data,
  });
}

// 删除入库货物明细
export function delWmsReceiveItemDetail(id) {
  return request({
    url: "/warehouse/wmsReceiveItemDetail/" + id,
    method: "delete",
  });
}

// 上架
export function shelves(data) {
  return request({
    url: "/warehouse/wmsReceiveItemDetail/shelves",
    method: "put",
    data: data,
  });
}

// 取消
export function cancel(data) {
  return request({
    url: "/warehouse/wmsReceiveItemDetail/cancel",
    method: "put",
    data: data,
  });
}

// 取消全部
export function cancelAll(data) {
  return request({
    url: "/warehouse/wmsReceiveItemDetail/cancelAll",
    method: "put",
    data: data,
  });
}

//质检
export function qualityCheck(data) {
  return request({
    url: "/warehouse/wmsReceiveItemDetail/qualityCheck",
    method: "put",
    data: data,
  });
}

// 批量上架
export function batchShelves(data) {
  return request({
    url: "/warehouse/wmsReceiveItemDetail/batchShelves",
    method: "put",
    data: data,
  });
}
