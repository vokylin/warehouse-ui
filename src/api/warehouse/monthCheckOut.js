import request from '@/utils/request'

// 查询月结列表
export function listMonthCheckOut(query) {
  return request({
    url: '/warehouse/monthCheckOut/list',
    method: 'get',
    params: query
  })
}

export function checkNoticeMonth(month) {
  return request({
    url: `/warehouse/monthCheckOut/checkNotice/${month}`,
    method: 'get'
  })
}


export function monthSettlement(data) {
  return request({
    url: '/warehouse/monthCheckOut/settlement',
    method: 'post',
    data
  })
}

export function monthReverse(data) {
  return request({
    url: '/warehouse/monthCheckOut/reverse',
    method: 'post',
    data
  })
}
