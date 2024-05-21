<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="月份">
        <el-date-picker
          v-model="queryParams.yearMonths"
          value-format="yyyy-MM"
          style="width: 240px"
          type="month"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="物料编码" prop="itemCode">
        <el-input
          v-model="queryParams.itemCode"
          placeholder="请输入物料编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料名称" prop="itemName">
        <el-input
          v-model="queryParams.itemName"
          placeholder="请输入物料名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-edit"
          size="mini"
          @click="checkNoticeMonth"
          v-hasPermi="['warehouse:monthCheckOut:settlement']"
        >月结</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-edit"
          size="mini"
          @click="reverseSettlement"
          v-hasPermi="['warehouse:monthCheckOut:reverse']"
        >反月结</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="monthCheckOutList" >
      <el-table-column label="月份" align="center" prop="yearMonths" />
      <el-table-column label="物料编码" align="center" prop="itemCode" />
      <el-table-column label="物料名称" align="center" prop="itemName" />
      <el-table-column label="单位" align="center" prop="itemUnit" />
      <el-table-column label="期初数量" align="center" prop="openingQuantity" />
      <el-table-column label="入库数量" align="center" prop="inQuantity" />
      <el-table-column label="出库数量" align="center" prop="outQuantity" />
      <el-table-column label="月末库存" align="center" prop="endingQuantity" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listMonthCheckOut, checkNoticeMonth, monthSettlement, monthReverse } from "@/api/warehouse/monthCheckOut";

export default {
  name: "MonthCheckOut",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 月结表格数据
      monthCheckOutList: [],
      // 查询参数
      queryParams: {
        companyId: this.$store.getters.companyId,
        pageNum: 1,
        pageSize: 10,
        yearMonths: null,
        itemCode: null,
        itemName: null
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询月结列表 */
    getList() {
      this.loading = true;
      listMonthCheckOut(this.queryParams).then(response => {
        this.monthCheckOutList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 月结 */
    handleSettlement() {
      this.$modal.loading("正在月结...");
      const obj = { yearMonths: this.queryParams.yearMonths, companyId: this.queryParams.companyId }
      monthSettlement(obj).then(() => {
        this.$modal.closeLoading()
        this.$modal.msgSuccess("月结完成");
        this.getList()
      }).catch(() => { this.$modal.closeLoading() })
    },
    /** 检查是否还有未完成的出入库通知 */
    checkNoticeMonth() {
      if (!this.queryParams.yearMonths) {
        this.$message.warning("请选择需要月结的月份")
        return
      }
      checkNoticeMonth(this.queryParams.yearMonths).then((res) => {
        if (res.msg) {
          this.$confirm(`存在${res.msg}是否继续月结？`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",}).then(() => {
              this.handleSettlement()
          })
        } else {
          this.handleSettlement()
        }
      }).catch(() => { })
    },

    /** 反月结 */
    reverseSettlement() {
      if (!this.queryParams.yearMonths) {
        this.$message.warning("请选择需要反月结的月份")
        return
      }
      this.$modal.loading("正在反月结...");
      const obj = { yearMonths: this.queryParams.yearMonths, companyId: this.queryParams.companyId }
      monthReverse(obj).then(() => {
        this.$modal.closeLoading()
        this.$modal.msgSuccess("反月结完成");
        this.getList()
      }).catch(() => { this.$modal.closeLoading() })
    }
  }
}
</script>
