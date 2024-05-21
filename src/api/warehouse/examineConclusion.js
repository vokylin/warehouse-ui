import request from '@/utils/request'

// 查询examineConclusion列表
export function listExamineConclusion(query) {
  return request({
    url: '/warehouse/examineConclusion/list',
    method: 'get',
    params: query
  })
}

// 查询examineConclusion详细
export function getExamineConclusion(id) {
  return request({
    url: '/warehouse/examineConclusion/' + id,
    method: 'get'
  })
}

// 查询examineConclusion详细
export function getByExamineId(id) {
  return request({
    url: "/warehouse/examineConclusion/getByExamineId/" + id,
    method: "get",
  });
}

// 新增examineConclusion
export function addExamineConclusion(data) {
  return request({
    url: '/warehouse/examineConclusion',
    method: 'post',
    data: data
  })
}

// 修改examineConclusion
export function updateExamineConclusion(data) {
  return request({
    url: '/warehouse/examineConclusion',
    method: 'put',
    data: data
  })
}

// 删除examineConclusion
export function delExamineConclusion(id) {
  return request({
    url: '/warehouse/examineConclusion/' + id,
    method: 'delete'
  })
}
