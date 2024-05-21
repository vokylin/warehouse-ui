import request from '@/utils/request'

// 查询作业通知明细列表
export function listWorkNoticeDetail(query) {
  return request({
    url: '/warehouse/workNoticeDetail/list',
    method: 'get',
    params: query
  })
}

// 查询作业通知明细详细
export function getWorkNoticeDetail(id) {
  return request({
    url: '/warehouse/workNoticeDetail/' + id,
    method: 'get'
  })
}

// 新增作业通知明细
export function addWorkNoticeDetail(data) {
  return request({
    url: '/warehouse/workNoticeDetail',
    method: 'post',
    data: data
  })
}

// 修改作业通知明细
export function updateWorkNoticeDetail(data) {
  return request({
    url: '/warehouse/workNoticeDetail',
    method: 'put',
    data: data
  })
}

// 删除作业通知明细
export function delWorkNoticeDetail(id) {
  return request({
    url: '/warehouse/workNoticeDetail/' + id,
    method: 'delete'
  })
}

// 分配
export function allot(data) { 
  return request({
    url: '/warehouse/workNoticeDetail/allot',
    method: 'put',
    data: data
  })
}

// 分配
export function batchAllot(data) { 
  return request({
    url: '/warehouse/workNoticeDetail/batchAllot',
    method: 'put',
    data: data
  })
}

// 取消分配
export function cancelAllot(id) {
  return request({
    url: "/warehouse/workNoticeDetail/cancelAllot/" + id,
    method: "put",
  });
}

// 提交分配
export function submitAllot(id) {
  return request({
    url: "/warehouse/workNoticeDetail/submitAllot/" + id,
    method: "put",
  });
}
