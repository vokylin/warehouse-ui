import request from "@/utils/request";

// 查询库存汇总列表
export function listItemStorage(query) {
  return request({
    url: "/warehouse/itemStorage/list",
    method: "get",
    params: query,
  });
}

// 查询库存汇总详细
export function getItemStorage(id) {
  return request({
    url: "/warehouse/itemStorage/" + id,
    method: "get",
  });
}

// 新增库存汇总
export function addItemStorage(data) {
  return request({
    url: "/warehouse/itemStorage",
    method: "post",
    data: data,
  });
}

// 修改库存汇总
export function updateItemStorage(data) {
  return request({
    url: "/warehouse/itemStorage",
    method: "put",
    data: data,
  });
}

// 删除库存汇总
export function delItemStorage(id) {
  return request({
    url: "/warehouse/itemStorage/" + id,
    method: "delete",
  });
}

// 查询库存汇总详细
export function getStorageCount(params) {
  return request({
    url: "/warehouse/itemStorage/index",
    method: "get",
    params: params,
  });
}
