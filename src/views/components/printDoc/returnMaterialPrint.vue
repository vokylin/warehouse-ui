<template>
  <el-dialog
    title="打印预览"
    :visible.sync="openVisible"
    width="1200px"
    append-to-body
    :lodding="printLoading"
  >
    <el-dialog
      width="60%"
      title="修改备注"
      :visible.sync="innerVisible"
      append-to-body
    >
      <el-table :data="tableData">
        <el-table-column label="存货编码" align="center" prop="itemCode" />
        <el-table-column label="物料名称" align="center" prop="itemName" />
        <el-table-column label="批号" align="center" prop="batchNo" />
        <el-table-column label="备注" align="center" prop="remark">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark"></el-input>
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="saveRemark">确 定</el-button>
      </span>
    </el-dialog>

    <el-tabs v-model="selectWarehouse" type="card" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in printInfoList"
        :key="item.warehouseCode"
        :label="item.warehouseName"
        :name="item.warehouseCode"
      ></el-tab-pane>
    </el-tabs>
    <div id="printContentD" class="cont">
      <div class="company-name">{{ printInfo.companyName }}</div>
      <div class="document-name">{{ documentName }}</div>
      <div class="main-content">
        <div class="table-header">
          <div class="header-title">
            <span>版本：{{ varsion }}</span>
            <span>编号：{{ no }}</span>
          </div>
          <div class="header-title">
            <span>单号：{{ printInfo.documentNumber }}</span>
            <span>退料部门：{{ printInfo.deptName }}</span>
            <span
              >日期：{{
                parseTime(printInfo.dateTime, "{y}年{mm}月{dd}日")
              }}</span
            >
          </div>
        </div>
        <div class="table-body">
          <table border="2" align="center" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width: 5%">No.</td>
              <td style="width: 15%">存货编码</td>
              <td style="width: 20%">物料名称</td>
              <td style="width: 10%">批号</td>
              <td style="width: 10%">规格型号</td>
              <td style="width: 5%">单位</td>
              <td style="width: 5%">数量</td>
              <td style="width: 10%">单价（元）</td>
              <td style="width: 10%">金额（元）</td>
              <td style="width: 10%">用途</td>
            </tr>
            <tr v-for="index in 11" :key="index">
              <td>{{ printInfo.printItemDetailList[index - 1] && index }}</td>
              <td>
                {{
                  printInfo.printItemDetailList[index - 1] &&
                  printInfo.printItemDetailList[index - 1].itemCode
                }}
              </td>
              <td>
                {{
                  printInfo.printItemDetailList[index - 1] &&
                  printInfo.printItemDetailList[index - 1].itemName
                }}
              </td>
              <td>
                {{
                  printInfo.printItemDetailList[index - 1] &&
                  printInfo.printItemDetailList[index - 1].batchNo
                }}
              </td>
              <td>
                {{
                  printInfo.printItemDetailList[index - 1] &&
                  printInfo.printItemDetailList[index - 1].model
                }}
              </td>
              <td>
                {{
                  printInfo.printItemDetailList[index - 1] &&
                  printInfo.printItemDetailList[index - 1].unit
                }}
              </td>
              <td>
                {{
                  printInfo.printItemDetailList[index - 1] &&
                  printInfo.printItemDetailList[index - 1].quantity
                }}
              </td>
              <td>
                {{
                  printInfo.printItemDetailList[index - 1] &&
                  formatPrice(printInfo.printItemDetailList[index - 1].price)
                }}
              </td>
              <td>
                {{
                  printInfo.printItemDetailList[index - 1] &&
                  formatAmount(printInfo.printItemDetailList[index - 1].amount)
                }}
              </td>
              <td>
                {{
                  printInfo.printItemDetailList[index - 1] &&
                  printInfo.printItemDetailList[index - 1].remark
                }}
              </td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: left; padding-left: 5px">
                合计金额（元）
              </td>
              <td colspan="7" style="text-align: left; padding-left: 15px">
                {{ formatAmount(printInfo.totalAmount) }}
              </td>
            </tr>
          </table>
          <div class="content-info">
            <label>
              第一联：留存（白） 第二联：仓库（红） 第三联：财务（黄）
            </label>
          </div>
        </div>

        <div class="table-footer">
          <div class="footer-content-user">
            <span>领料人：{{ printInfo.operator }}</span>
            <span>主管：{{ printInfo.supervisor }}</span>
            <span>仓库：{{ printInfo.warehouseOperator }}</span>
            <span>主管：{{ printInfo.supervisor }}</span>
          </div>
          <div class="footer-content">
            <span
              >单号规则：库别代码-年月6位-流水号3位，库别代码：原辅料库（Y）、包材库（B）、产品库（C）、研发仓（YF）、半成品仓（BCP）、客户来料仓（KH）、退货召回仓（TH）、耗材仓（HC）</span
            >
          </div>
        </div>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="openVisible = false">取 消</el-button>
      <el-button @click="fillOutRemark">填写备注</el-button>
      <el-button v-print="printObj" type="primary">打 印</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getPrintInfo } from "@/api/warehouse/print";
import { updateRemark } from "@/api/warehouse/storageInOutRecord";
export default {
  data() {
    return {
      openVisible: false,
      printLoading: true,
      printObj: {
        id: "printContentD",
        beforeOpenCallback(vue) {
          vue.printLoading = true;
        },
        openCallback(vue) {
          vue.printLoading = false;
        },
        closeCallback(vue) {
          vue.openVisible = false;
        },
      },
      documentName: "退料单",
      varsion: "03",
      no: "QR-714-000-04",
      printInfo: {},
      printInfoList: [],
      selectWarehouse: "",
      isShowPrice: false,
      innerVisible: false,
      params: {
        noticeId: "",
        documentType: 2,
      },
      tableData: [],
    };
  },
  methods: {
    open(noticeId, isShowPrice) {
      this.isShowPrice = isShowPrice;
      this.params.noticeId = noticeId;
      this.getPrintInfoData();
      this.openVisible = true;
    },

    getPrintInfoData() {
      getPrintInfo(this.params).then((res) => {
        if (res.data == null || res.data.length == 0) {
          this.$message.error("打印信息为空");
          return;
        }
        this.printInfoList = res.data;
        this.printInfo = res.data[0];
        this.selectWarehouse = res.data[0].warehouseCode;
        this.tableData = res.data[0].printItemDetailList;
      });
    },

    handleClick() {
      console.log(this.selectWarehouse);
      this.printInfoList.forEach((item) => {
        if (item.warehouseCode == this.selectWarehouse) {
          this.$set(this, "printInfo", item);
          this.tableData = item.printItemDetailList;
        }
      });
    },

    reset() {
      this.printInfo = {};
      this.printInfoList = [];
      this.selectWarehouse = "";
      this.isShowPrice = false;
    },
    formatAmount(amount) {
      if (this.isShowPrice) {
        return parseFloat(amount.toFixed(2)).toLocaleString();
      } else {
        return Number(0);
      }
    },
    formatPrice(price) {
      if (this.isShowPrice) {
        let formatPrice = Number(price);
        if (formatPrice != 0 && formatPrice > 1000) {
          return formatPrice.toLocaleString();
        }
        return formatPrice;
      } else {
        return Number(0);
      }
    },
    fillOutRemark() {
      this.innerVisible = true;
    },
    saveRemark() {
      updateRemark(this.tableData).then((res) => {
        this.$message({
          type: "success",
          message: "保存成功!",
        });
        this.innerVisible = false;
      });
    },
    cancel() {
      this.getPrintInfoData();
      this.innerVisible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
@page {
  size: A5 landscape; /* auto is the initial value */
  margin: 3mm; /* this affects the margin in the printer settings */
}
.cont {
  width: 29.7cm;
  min-height: 19.8cm;
  margin: 0 auto;
  font-family: "宋体";
}
.company-name {
  font-family: "楷体", "楷体_GB2312";
  font-size: 26px;
  text-align: center;
  color: #7c7c7c;
  margin-bottom: 20px;
  padding-top: 50px;
}
.document-name {
  font-family: "宋体";
  font-size: 29px;
  color: #000;
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 20px;
  text-shadow: 0.15pt 0px 0px black, 0.25pt 0px 0px black, 0.35pt 0px 0px black,
    -0.25pt 0px 0px black, 0px 0.25pt 0px black, 0px -0.25pt 0px black;
}
.main-content {
  margin: 0 55px;
}
.content-info {
  writing-mode: vertical-rl;
  font-family: "宋体";
  width: 20px;
  font-size: 11px;
  margin-top: 10px;
}

.table-header {
  .header-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    span {
      font-size: 13px;
      color: #000000;
      font-family: "宋体";
    }
  }
  .header-title-center {
    // 右对齐
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
    span {
      font-size: 13px;
      color: #000000;
      font-family: "宋体";
    }
  }
}
.table-body {
  display: flex;
  //height: 11cm;
  table {
    width: 100%;
    border-collapse: collapse;
    tr {
      height: 28px;
      td {
        text-align: center;
        font-size: 13px;
        color: #000000;
        font-family: "宋体";
      }
    }
  }
}
.table-footer {
  margin-top: 8px;
  .footer-content-user {
    span {
      display: inline-block;
      width: 25%;
      font-size: 13px;
      color: #000000;
      font-family: "宋体";
    }
  }
  .footer-content {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
    span {
      font-size: 13px;
      color: #000000;
      font-family: "宋体";
    }
  }
}
</style>
