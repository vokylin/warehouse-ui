import request from '@/utils/request'

// 查询公司管理列表
export function listCompany(query) {
  return request({
    url: '/system/company/list',
    method: 'get',
    params: query
  })
}

// 查询公司管理详细
export function getCompany(id) {
  return request({
    url: '/system/company/' + id,
    method: 'get'
  })
}

// 新增公司管理
export function addCompany(data) {
  return request({
    url: '/system/company',
    method: 'post',
    data: data
  })
}

// 修改公司管理
export function updateCompany(data) {
  return request({
    url: '/system/company',
    method: 'put',
    data: data
  })
}

// 删除公司管理
export function delCompany(id) {
  return request({
    url: '/system/company/' + id,
    method: 'delete'
  })
}


// 查询公司列表（排除节点）
export function listCompanyExcludeChild(id) {
  return request({
    url: "/system/company/list/exclude/" + id,
    method: "get",
  });
}

