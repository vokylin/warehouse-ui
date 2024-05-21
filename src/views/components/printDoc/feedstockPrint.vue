<template>
  <div>
    <div class="wrapper">
      <div class="header">
        <h3>打印预览</h3>
        <div v-print="printObj" class="printer"></div>
      </div>
      <div id="printTest" class="cont">
        <div class="company-name">{{ process.env.VUE_APP_TITLE }}</div>
        <div class="document-name">进料验收单</div>
        <div class="main-content">
          <div class="table-header">
            <div class="header-title">
              <span>版本：<span style="font-family: 'Times New Roman'">03</span></span>
              <span style="width: 155px">编号：<span style="font-family: 'Times New Roman'">QR-706-000-04</span></span>
            </div>
            <div style="margin-bottom: 30px;" class="header-title">
              <span>进料验收单编号：<span style="font-family: 'Times New Roman'">{{ purchaseInfo.formNumber || ''
                  }}</span></span>
              <span style="width: 155px">日期：{{ purchaseInfo.formDate || '' }}</span>
            </div>
          </div>
          <div class="table-body">
            <table border="1">
              <tr>
                <td>
                  <table border="2" align="center" cellpadding="0" cellspacing="0" frame="below">
                    <tr style="height: 30px">
                      <td colspan="4" class="m-title">物料信息</td>
                    </tr>

                    <tr>
                      <td style="width: 20%">物料编码</td>
                      <td style="width: 30%" class="form-content">{{ purchaseInfo.itemCode || ''}}</td>
                      <td style="width: 20%">供应商</td>
                      <td style="width: 30%" class="form-content">{{ purchaseInfo.supplierName || '' }}</td>
                    </tr>
                    <tr>
                      <td style="width: 20%">物料名称</td>
                      <td style="width: 30%" class="form-content">{{ purchaseInfo.itemName || '' }}</td>
                      <td style="width: 20%">储存条件</td>
                      <td style="width: 30%" class="form-content">{{ purchaseInfo.storageConditions || '' }}</td>
                    </tr>
                    <tr>
                      <td style="width: 20%">规格型号</td>
                      <td style="width: 30%" class="form-content">{{ purchaseInfo.spec || '' }}</td>
                      <td style="width: 20%">生产日期</td>
                      <td style="width: 30%" class="form-content">{{ purchaseInfo.produceTime }}</td>
                    </tr>
                    <tr>
                      <td style="width: 20%">生产批号</td>
                      <td style="width: 30%" class="form-content">{{ purchaseInfo.batchNo || '' }}</td>
                      <td style="width: 20%">保质期至</td>
                      <td style="width: 30%" class="form-content">{{ purchaseInfo.expireTime || '' }}</td>
                    </tr>
                    <tr>
                      <td style="width: 20%">加密编码</td>
                      <td style="width: 30%" class="form-content">{{ purchaseInfo.encryptionCode || '' }}</td>
                      <td style="width: 20%">备注</td>
                      <td style="width: 30%" class="form-content">{{ purchaseInfo.remark || '' }}</td>
                    </tr>

                    <tr style="height: 30px">
                      <td colspan="4" class="m-title">采购签收</td>
                    </tr>
                    <tr>
                      <td style="width: 20%">采购订单号</td>
                      <td style="width: 30%">{{ purchaseInfo.orderSn || '' }}</td>
                      <td style="width: 20%">签收人</td>
                      <td style="width: 30%">{{ purchaseInfo.signer || '' }}</td>
                    </tr>
                  </table>
                  <table border="2" align="center" cellpadding="0" cellspacing="0" frame="void">
                    <tr>
                      <td style="width: 20%">进料数量</td>
                      <td style="width: 13%">{{ purchaseInfo.quantity }}</td>
                      <td style="width: 12%">库存单位</td>
                      <td style="width: 12%">{{ purchaseInfo.unit || '' }}</td>
                      <td style="width: 13%">请验附件</td>
                      <td style="width: 30%;" class="form-content">
                        {{ purchaseInfo.annex === '1' || purchaseInfo.annex === '3' ? '☑供方品质证明' : '□供方品质证明' }}
                        {{ purchaseInfo.annex === '2' || purchaseInfo.annex === '3' ? '☑其它：' : '□其它：' }}
                        {{ purchaseInfo.annex !== '1' ? purchaseInfo.annexDesc : '' }}
                      </td>
                    </tr>
                  </table>

                  <table border="2" align="center" cellpadding="0" cellspacing="0" frame="above">
                    <tr>
                      <td style="width: 20%">备注</td>
                      <td style="width: 80%;" class="form-content">
                        {{ purchaseInfo.purchaseType === '1' ? '☑正常购料' : '□正常购料' }}
                        {{ purchaseInfo.purchaseType === '2' ? '☑补/换货' : '□补/换货' }}
                        {{ purchaseInfo.purchaseType === '3' ? '☑赠送' : '□赠送' }}
                        {{ purchaseInfo.purchaseType === '4' ? '☑其他：' : '□其他：' }}
                        {{ purchaseInfo.purchaseTypeDesc || '' }}
                      </td>
                    </tr>
                  </table>

                  <table border="2" align="center" cellpadding="0" cellspacing="0" frame="above">
                    <tr style="height: 30px">
                      <td colspan="4" class="m-title">质量验收</td>
                    </tr>

                    <tr>
                      <td rowspan="3">抽样计划</td>
                      <td colspan="3">
                        {{ examineDeliveryInfo.checkType === '1' ? '☑正常检验' : '□正常检验' }}
                        {{ examineDeliveryInfo.checkType === '2' ? '☑放宽检验' : '□放宽检验' }}
                        {{ examineDeliveryInfo.checkType === '3' ? '☑加严检验' : '□加严检验' }}
                        {{ examineDeliveryInfo.checkType === '4' ? '☑全检' : '□全检' }}
                        {{ examineDeliveryInfo.checkType === '5' ? '☑免验' : '□免验' }}
                      </td>
                    </tr>
                    <tr>
                      <td>抽样数量</td>
                      <td colspan="2">留样数量</td>
                    </tr>
                    <tr>
                      <td>{{ examineDeliveryInfo.sampleQuantity}}</td>
                      <td colspan="2">{{ examineDeliveryInfo.keepQuantity}}</td>
                    </tr>
                    <tr>
                      <td rowspan="2" style="width: 20%">验收结果</td>
                      <td style="width: 40%">不合格数</td>
                      <!--<td style="width: 20%">报废数量</td>-->
                      <td style="width: 40%" colspan="2">合格数量</td>
                    </tr>
                    <tr>
                      <td>{{ examineDeliveryInfo.failQuantity }}</td>
                      <!--<td>{{ examineDeliveryInfo.scrapQuantity }}</td>-->
                      <td colspan="2">{{ examineDeliveryInfo.passQuantity }}</td>
                    </tr>
                    <tr>
                      <td rowspan="2">附件<br />(验收记录)</td>
                      <td colspan="3"
                        style="text-align: left; border-bottom: 0px; padding-left: 10px; padding-top: 10px;">
                        {{ examineDeliveryInfo.annexType === '1' || examineDeliveryInfo.annexType === '3' ? `☑ 测试报告
                        编号：${ examineDeliveryInfo.annexRecord || ''}` : '□ 测试报告 编号：' }}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3"
                        style="text-align: left; border-top: 0px; padding-left: 10px; padding-bottom: 10px;">
                        {{ examineDeliveryInfo.annexType === '2' || examineDeliveryInfo.annexType === '3' ? `☑ 其他：${
                        examineDeliveryInfo.annexOtherRecord || '' }` : '□ 其他：' }}
                      </td>
                    </tr>
                    <tr>
                      <td rowspan="2">判定</td>
                      <td colspan="3"
                        style="text-align: left; border-bottom: 0px; padding-left: 10px; padding-top: 10px;">
                        {{ examineDeliveryInfo.resultStatus === '2' ? '☑ 合格' : '□ 合格' }}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3"
                        style="text-align: left; border-top: 0px; padding-left: 10px; padding-bottom: 10px;">
                        {{ examineDeliveryInfo.resultStatus === '3' ? ' ☑ 不合格，不良原因说明：' : ' □ 不合格，不良原因说明：' }}
                        {{ examineDeliveryInfo.resultDesc || '' }}
                      </td>
                    </tr>

                    <tr>
                      <td>检验人</td>
                      <td>{{ examineDeliveryInfo.examinerName }}</td>
                      <td width="20%">检验主管</td>
                      <td>{{ examineDeliveryInfo.examineManager }}</td>
                    </tr>

                    <tr style="height: 30px">
                      <td colspan="4" class="m-title">仓库入库</td>
                    </tr>
                    <tr>
                      <td rowspan="3">处理情况</td>
                      <td colspan="3" style="text-align: left; border-bottom: 0px; padding-left: 10px;">
                        {{ (examineDeliveryInfo.receiveStatus && examineDeliveryInfo.receiveStatus !== '2') ? `☑
                        允收/数量：${examineDeliveryInfo.receiveQuantity}` : '□ 允收/数量：' }}
                        <span style="padding-left: 150px;">
                          {{(examineDeliveryInfo.receiveStatus && examineDeliveryInfo.receiveStatus !== '1') ? `☑
                          退货/数量：${examineDeliveryInfo.refundQuantity}` : ' □ 退货/数量：' }}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3" style="
                          text-align: left;
                          border-bottom: 0px;
                          border-top: 0px;
                          padding-left: 10px;">
                        {{ examineDeliveryInfo.specialNo ? '☑ 特采/特采申请单编号：' : ' □ 特采/特采申请单编号：' }}
                        <span class="special_no">{{ examineDeliveryInfo.specialNo || '' }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3" style="text-align: left; border-top: 0px; padding-left: 10px;">
                        备注：{{ examineDeliveryInfo.wmsRemark || '' }}
                      </td>
                    </tr>
                    <tr>
                      <td>仓管</td>
                      <td>{{ examineDeliveryInfo.warehouseKeeper || '' }}</td>
                      <td>采购经办</td>
                      <td>{{ purchaseInfo.confirmer || '' }}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>

          <div class="footer-content">
            <span>处理流程：采购→仓库→质量→仓库→采购</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFeedstockPrintInfo } from "@/api/warehouse/print";

export default {
  data() {
    return {
      id: this.$route.query.examineWorkId,
      purchaseInfo: {},
      examineDeliveryInfo: {},
      printObj: {
        id: 'printTest', // 这里是要打印元素的ID
        popTitle: '', // 打印的标题
        extraCss: '', // 打印可引入外部的一个 css 文件
        extraHead: '', // 打印头部文字
        beforeOpenCallback(vue) {
          console.log('打开之前')
        },
        openCallback(vue) {
          console.log('执行了打印')
        },
        closeCallback(vue) {
          console.log('关闭了打印工具')
        }
      }
    }
  },

  created() {
    this.printRecord()
  },
  methods: {
    // 打印预览
    printRecord() {
      getFeedstockPrintInfo(this.id).then(({ data }) => {
        this.purchaseInfo = data.purchaseInfo || {}
        this.examineDeliveryInfo = data.examineDeliveryInfo || {}
      })
    },
    close() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
  * {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  html,
  body {
    width: 100%;
    height: 100%;
    font-family: "Arial Normal", "Arial";
    background: #d7d7d7;
    overflow: hidden;
  }

  .wrapper {
    max-width: 32cm;
    margin: 20px auto 0;
    border: 1px solid #000;
    min-height: 29.7cm !important;
    background: #ffffff;
    position: relative;
  }
  .header {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #aaaaaa;
    margin-bottom: 1cm;
  }
  .header h3 {
    font-weight: 600;
    font-size: 20px;
    margin-left: 30px;
  }
  .header .printer {
    cursor: pointer;
    margin-right: 30px;
  }
  .printer {
    width: 30px;
    height: 30px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABuklEQVR4Xu2bMU7EMBBF314BiUNQU0ED9IgGKLgCLTVwCko6JCSQoKZaaKDaEm7ACTgAyCtgI1YrOzMhMcN3k8ZjO99//rcdZ4S97AAnwKq9iU4ir4Fb4NLS2sgS9BlzBhw64rsMvQF2LQ16ABgDm5ZOfyHmHtiytNsVAGkAD5YBOGI2GhNQBQCmGXAA0GSgAKghBcQAB50toUoBieDMhiWCEsEKFkJyAYuUO2LkAnIBucD3blQ2KBuUDQ5/IPJn1wEHwB6wZPDkryOxJEJDFE//L8BdOhK7AvaHGH0FfU4SAO8VDGSwIQgAMUApIA2IIIK5DzOni1Q2igjmNkMLJ1kABHGBf88A80IqSgoIACsCYkAQEbQSADFADNBmSJuhCJshiaAVAbmAXEAu0MoFLoBza771FLcNHJX21UYDXoEV4K208YHqLQPPQHpmSxsAcocO2c56rFB8k90DwFqPL1TS1VOjUi8APAK1gJBefl0AzBAQA0r/ZvFogFIgigaU5stPG4zAgOkFiXTNJH07y/0BFg2ACXDs+WusZgaUrBumdQRAMVTzFcWAil2geF6VAsVQKQXmEAihAR8I6rVQPm5B0gAAAABJRU5ErkJggg==)
    no-repeat;
    background-size: 100% 100%;
  }
  .cont {
    padding: 1.7cm;
    width: 29.7cm;
    min-height: 20.8cm;
    margin: 0 auto;
    font-family: "宋体";
  }
  .company-name {
    font-family: "楷体", "楷体_GB2312";
    font-size: 20pt;
    text-align: center;
    color: #7c7c7c;
    margin-bottom: 20px;
  }
  .document-name {
    font-family: "宋体";
    font-size: 18pt;
    color: #000;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
    text-shadow: 0.15pt 0px 0px black, 0.25pt 0px 0px black, 0.35pt 0px 0px black,
    -0.25pt 0px 0px black, 0px 0.25pt 0px black, 0px -0.25pt 0px black;
  }
  .main-content {
    margin: 0 55px;
  }
  .table-content {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 20px;
    border-left: 2px solid #000;
    padding-left: 10px;
    label {
      writing-mode: vertical-rl;
      font-family: "宋体";
      font-size: 11px;
      color: #000000;
    }
  }
  .special_no {
    display: inline-block;
    border-bottom: 1px solid;
    width: 200px;
    padding-left: 5px;
  }

  .m-title {
    text-shadow: 0.05pt 0px 0px black, 0.25pt 0px 0px black, 0.25pt 0px 0px black, -0.15pt 0px 0px black, 0px 0.15pt 0px black;
  }
  .table-header {
    .header-title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      span {
        font-size: 12pt;
        color: #000000;
        font-family: "宋体";
      }
    }
  }
  .table-body {
    display: flex;
    table {
      width: 100%;
      border-collapse: collapse;
      tr {
        height: 40px;
        td {
          text-align: center;
          font-size: 10.5pt!important;
          color: #000000;
          font-family: "宋体";
        }
      }
    }
  }
  .footer-content {
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      font-size: 10.5pt!important;
      color: #000000;
      font-family: "宋体";
    }
  }
  .form-content {
    text-align: left!important;
    padding-left: 10px;
  }

  .footer {
    padding-bottom: 5px;
    display: flex;
    justify-content: space-between;
  }

  .back-btn {
    cursor: pointer;
    padding-left: 20px;
  }
  .remark{
    height:110px;
    border: 1px solid #000;
    border-top:0;
    line-height: 30px;
    padding:0 10px;
  }
  .remark>div:first-child{
    height: 80px;
  }
  .remark>div:last-child{
    text-align: right;
    padding-right: 150px;
  }
  // 去除页眉页脚
  @page {
    size: auto; /* auto is the initial value */
    margin: 3mm; /* this affects the margin in the printer settings */
    size: portrait; /* 纵向 */
  }
</style>
