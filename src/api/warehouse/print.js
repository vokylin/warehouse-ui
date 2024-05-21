import request from "@/utils/request";

// 获取打印数据
export function getPrintInfo(data) {
  return request({
    url:
      "/warehouse/print?documentType=" +
      data.documentType +
      "&noticeId=" +
      data.noticeId,
    method: "get",
  });
}


// 进料验收单数据获取
export function getFeedstockPrintInfo(id) {
  return request({
    url: "/warehouse/feedstockPrint/" + id,
    method: "get",
  });
}

// 报损单打印
export function getLossPrintInfo(id) {
  return request({
    url: "/warehouse/breakagePrint/" + id,
    method: "get",
  });
}