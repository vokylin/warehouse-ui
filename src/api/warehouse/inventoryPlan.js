import request from "@/utils/request";

// 查询盘点计划列表
export function listInventoryPlan(query) {
  return request({
    url: "/warehouse/inventoryPlan/list",
    method: "get",
    params: query,
  });
}

// 查询盘点计划详细
export function getInventoryPlan(id) {
  return request({
    url: "/warehouse/inventoryPlan/" + id,
    method: "get",
  });
}

// 新增盘点计划
export function addInventoryPlan(data) {
  return request({
    url: "/warehouse/inventoryPlan",
    method: "post",
    data: data,
  });
}

// 修改盘点计划
export function updateInventoryPlan(data) {
  return request({
    url: "/warehouse/inventoryPlan",
    method: "put",
    data: data,
  });
}

// 删除盘点计划
export function delInventoryPlan(id) {
  return request({
    url: "/warehouse/inventoryPlan/" + id,
    method: "delete",
  });
}

// 盘点作业
export function inventoryPlanJob(id) {
  return request({
    url: "/warehouse/inventoryPlan/work/" + id,
    method: "put",
  });
}

// 盘点完成
export function inventoryPlanFinish(id) {
  return request({
    url: "/warehouse/inventoryPlan/finish/" + id,
    method: "put",
  });
}
