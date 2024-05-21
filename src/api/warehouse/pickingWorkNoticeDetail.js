import request from '@/utils/request'

// 查询拣货作业通知明细列表
export function listPickingWorkNoticeDetail(query) {
  return request({
    url: '/warehouse/pickingWorkNoticeDetail/list',
    method: 'get',
    params: query
  })
}

// 查询拣货作业通知明细详细
export function getPickingWorkNoticeDetail(id) {
  return request({
    url: '/warehouse/pickingWorkNoticeDetail/' + id,
    method: 'get'
  })
}

// 新增拣货作业通知明细
export function addPickingWorkNoticeDetail(data) {
  return request({
    url: '/warehouse/pickingWorkNoticeDetail',
    method: 'post',
    data: data
  })
}

// 修改拣货作业通知明细
export function updatePickingWorkNoticeDetail(data) {
  return request({
    url: '/warehouse/pickingWorkNoticeDetail',
    method: 'put',
    data: data
  })
}

// 删除拣货作业通知明细
export function delPickingWorkNoticeDetail(id) {
  return request({
    url: '/warehouse/pickingWorkNoticeDetail/' + id,
    method: 'delete'
  })
}

// 缺货登记
export function shortageCheckIn(data) {
  return request({
    url: "/warehouse/pickingWorkNoticeDetail/shortageCheckIn",
    method: "put",
    data: data,
  });
}