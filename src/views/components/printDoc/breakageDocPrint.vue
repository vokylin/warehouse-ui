<template>
  <el-dialog
    title="打印预览"
    :visible.sync="openVisible"
    width="1200px"
    append-to-body
    :lodding="printLoading"
  >
    <el-tabs v-model="selectKey" type="card" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in printInfoArr"
        :key="item.selectKey"
        :label="item.itemName"
        :name="item.selectKey"
      ></el-tab-pane>
    </el-tabs>

    <div id="breakageDocPrint" class="breakage-doc">
      <div class="company-name">{{ printData.companyName }}</div>
      <div class="document-name">{{ printData.documentName }}</div>
      <div class="main-content">
        <div class="table-header">
          <div class="header-title">
            <span>版本：{{ printData.version }}</span>
            <span>编号：{{ printData.no }}</span>
          </div>
          <div class="header-title">
            <span
              >填表日期：{{ parseTime(printInfo.occTime, "{y}.{m}.{d}") }}</span
            >
            <span>编号：{{ printInfo.printNumber }}</span>
          </div>
        </div>
        <div class="table-body">
          <table border="2" cellpadding="0" cellspacing="0">
            <tr style="height: 50px; text-align: center">
              <td style="width: 6%">填表人</td>
              <td style="width: 15%">{{ printInfo.applicant }}</td>
              <td style="width: 15%">填表部门主管</td>
              <td style="width: 10%">{{ printInfo.deptSupervisor }}</td>
              <td style="width: 15%">品管确认</td>
              <td style="width: 10%">{{ printInfo.qualitySupervisor }}</td>
              <td style="width: 10%">质量部主管</td>
              <td style="width: 10%">{{ printInfo.quantityDeptSupervisor }}</td>
            </tr>

            <tr style="height: 50px; text-align: center">
              <td>项次</td>
              <td>产品名称</td>
              <td>批号或工单编号</td>
              <td>数量</td>
              <td>不良原因</td>
              <td colspan="2">品管鉴定</td>
              <td>责任单位</td>
            </tr>

            <tr v-for="index in 1" :key="index" style="height: 90px">
              <td style="text-align: center">1</td>
              <td style="vertical-align: top">
                <span style="display: block; margin: 5px 5px">
                  {{ printInfo.itemName }}
                </span>
              </td>
              <td style="vertical-align: top">
                <span style="display: block; margin: 5px 5px">
                  {{ printInfo.batchNo }}</span
                >
              </td>
              <td style="vertical-align: top">
                <span style="display: block; margin: 5px 5px">{{
                  printInfo.quantity
                }}</span>
              </td>
              <td style="vertical-align: top">
                <span style="display: block; margin: 5px 5px">{{
                  printInfo.badCauses
                }}</span>
              </td>
              <td colspan="2" style="text-align: left">
                <div style="height: 6px;margin-left: 3px">□报废□返工□全检</div>
                <br />
                <div style="height: 6px;margin-left: 3px;">□其他_________</div>
                <br />
                <div style="height: 6px;margin-left: 3px;">□调查</div>
                <br />
                <div style="height: 6px;margin-left: 3px;margin-bottom: 10px;">异常单号：</div>
              </td>
              <td></td>
            </tr>
            <tr style="height: 35px">
              <td rowspan="2" style="text-align: center">处理结果确认</td>
              <td colspan="8" style="text-align: left; border-bottom: 0px;padding-left:5px">
                处理结果：
              </td>
            </tr>

            <!-- <tr>
                <td colspan="8" style="text-align: left"></td>
              </tr> -->
            <tr style="height: 35px">
              <td
                colspan="2"
                style="text-align: left; border-top: 0px; border-right: 0px;padding-left:5px"
              >
                操作人签字：
              </td>
              <td
                colspan="2"
                style="
                  text-align: left;
                  border-top: 0px;
                  border-left: 0px;
                  border-right: 0px;
                "
              >
                协同人签字：
              </td>
              <td
                colspan="3"
                style="text-align: left; border-top: 0px; border-left: 0px"
              >
                处理日期：
              </td>
            </tr>

            <tr style="height: 50px">
              <td colspan="9" style="text-align: left;padding-left:5px">备注：</td>
            </tr>
          </table>
        </div>

        <div class="table-footer">
          <div class="footer-content">
            <span
              >第一联：承办单位留存(白)；第二联：提出单位留存(红)；第三联：处理单位标示(黄)</span
            >
          </div>
        </div>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="openVisible = false">取 消</el-button>
      <el-button v-print="printObj" type="primary">打 印</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getLossPrintInfo } from "@/api/warehouse/print";
export default {
  data() {
    return {
      openVisible: false,
      printLoading: true,
      printObj: {
        id: "breakageDocPrint",
        beforeOpenCallback(vue) {
          vue.printLoading = true;
          console.log("打开之前");
        },
        openCallback(vue) {
          vue.printLoading = false;
          console.log("执行了打印");
        },
        closeCallback(vue) {
          vue.openVisible = false;
          console.log("关闭了打印工具");
        },
      },
      printData: {
        companyName: process.env.VUE_APP_TITLE,
        documentName: "不合格品处理单",
        version: "01",
        no: "QR-808-000-01",
      },
      breakageDocId: "",
      printInfoArr: [],
      printInfo: {},
      selectKey: "",
    };
  },
  methods: {
    open(breakageDocId) {
      this.breakageDocId = breakageDocId;
      this.getPrintInfoData();
      this.openVisible = true;
    },
    // 获取打印数据
    getPrintInfoData() {
      getLossPrintInfo(this.breakageDocId).then((res) => {
        if (res.data == null || res.data.length == 0) {
          this.$message.error("打印信息为空");
          return;
        }
        console.log(res.data);
        this.printInfoArr = res.data;
        this.printInfoArr.forEach(
          (item) => (item.selectKey = item.itemCode + item.batchNo)
        );
        this.printInfo = this.printInfoArr[0];
      });
    },

    // 切换table
    handleClick() {
      this.printInfoArr.forEach((item) => {
        if (item.selectKey == this.selectKey) {
          this.$set(this, "printInfo", item);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@page {
  margin: 3mm; /* this affects the margin in the printer settings */
  size: A5 landscape;;
}

.breakage-doc {
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
  padding-top: 80px;
}
.document-name {
  font-family: "宋体";
  font-size: 29px;
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
  height: 9.5cm;
  table {
    width: 100%;
    border-collapse: collapse;
    tr {
      td {
        font-size: 14px;
        color: #000000;
        font-family: "宋体";
      }
    }
  }
}
.table-footer {
  .footer-content {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    span {
      font-size: 13px;
      color: #000000;
      font-family: "宋体";
    }
  }
}
</style>
