<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="物料名称" prop="itemName">
        <el-input
          v-model="queryParams.itemName"
          placeholder="请输入物料名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料编码" prop="itemCode" label-width="90px">
        <el-input
          v-model="queryParams.itemCode"
          placeholder="请输入物料编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="质检单号" prop="id" label-width="120px">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入质检单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="入库通知单号"
        prop="receiveNoticeId"
        label-width="120px"
      >
        <el-input
          v-model="queryParams.receiveNoticeId"
          placeholder="请输入入库通知单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-table-column label="通知状态" prop="operateStatus">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.examine_work_notice_status"
            :value="scope.row.operateStatus"
          />
        </template>
      </el-table-column>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          size="mini"
          type="primary"
          :disabled="single || !isShelves"
          icon="el-icon-upload2"
          plain
          @click="handleShelves"
          v-hasPermi="['warehouse:examineWork:shelves']"
          >上架作业</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          size="mini"
          type="danger"
          :disabled="single || !isRefund"
          icon="el-icon-download"
          plain
          @click="handleRefund"
          v-hasPermi="['warehouse:examineWork:refund']"
          >退货作业</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          size="mini"
          type="success"
          :disabled="single"
          icon="el-icon-edit"
          plain
          @click="handleExaminConclusion"
          v-hasPermi="['warehouse:examineConclusion:edit']"
          >填写结论</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          size="mini"
          type="success"
          :disabled="single"
          plain
          @click="handlePrint"
          icon="el-icon-document"
          v-hasPermi="['warehouse:examineWork:print']"
          >进料验收单</el-button
        >
      </el-col>

      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="examineWorkList"
      @selection-change="handleSelectionChange"
      :default-sort="defaultSort"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="质检任务编号"
        width="180"
        align="center"
        prop="id"
      />
      <!-- <el-table-column label="通知状态" align="center" prop="operateStatus">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.examine_work_notice_status"
            :value="scope.row.operateStatus"
          />
        </template>
      </el-table-column> -->
      <el-table-column
        label="入库通知单号"
        width="180"
        align="center"
        prop="receiveNoticeId"
      />
      <el-table-column
        label="物料编码"
        width="180"
        align="center"
        prop="itemCode"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      />
      <el-table-column
        label="物料名称"
        width="180"
        align="center"
        prop="itemName"
        show-overflow-tooltip
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      />
      <el-table-column
        label="物料批次"
        width="180"
        align="center"
        prop="batchNo"
      />
      <el-table-column
        label="质检状态"
        align="center"
        prop="status"
        width="120"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.examine_status"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="抽样数量" align="center" prop="sampleQuantity" />
      <el-table-column label="留样数量" align="center" prop="keepQuantity" />
      <el-table-column
        label="抽样退还数量"
        align="center"
        prop="sampleRefundQuantity"
        width="140"
      />
      <el-table-column label="不合格数" align="center" prop="failQuantity" />
      <!-- <el-table-column label="报废数量" align="center" prop="scrapQuantity" /> -->
      <el-table-column label="合格数量" align="center" prop="passQuantity" />
      <el-table-column label="质检总数" align="center" prop="allQuantity" />
      <el-table-column label="检验员" align="center" prop="examineBy" />
      <el-table-column label="检验主管" align="center" prop="examineManager" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="160"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      />
      <!-- <el-table-column label="公司ID" align="center" prop="companyId" /> -->
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改examineConclusion对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-descriptions class="margin-top" :column="3" border size="mini">
        <el-descriptions-item label="质检任务ID">{{
          form.examineId
        }}</el-descriptions-item>
        <el-descriptions-item label="入库通知单号">{{
          form.receiveNoticeId
        }}</el-descriptions-item>
        <el-descriptions-item label="质检状态">
          <dict-tag :options="dict.type.examine_status" :value="form.status" />
        </el-descriptions-item>
        <el-descriptions-item label="物料编码">{{
          form.itemCode
        }}</el-descriptions-item>
        <el-descriptions-item label="物料名称">{{
          form.itemName
        }}</el-descriptions-item>
        <el-descriptions-item label="物料批次">{{
          form.batchNo
        }}</el-descriptions-item>
        <el-descriptions-item label="单位">{{
          form.unit
        }}</el-descriptions-item>
        <el-descriptions-item label="抽样数量">{{
          form.sampleQuantity
        }}</el-descriptions-item>
        <el-descriptions-item label="留样数量">{{
          form.keepQuantity
        }}</el-descriptions-item>
        <el-descriptions-item label="不合格数">{{
          form.failQuantity
        }}</el-descriptions-item>
        <el-descriptions-item label="抽样退还数量">{{
          form.sampleRefundQuantity
        }}</el-descriptions-item>
        <el-descriptions-item label="合格数量">{{
          form.passQuantity
        }}</el-descriptions-item>
        <el-descriptions-item label="质检总数">{{
          form.allQuantity
        }}</el-descriptions-item>
      </el-descriptions>

      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
        style="margin-top: 20px"
        size="small"
      >
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>结论信息</span>
          </div>

          <el-row>
            <el-col :span="12">
              <el-form-item label="收货状态">
                <el-checkbox-group
                  v-model="checkList"
                  @change="changeReceiveStatus"
                >
                  <el-checkbox label="1">允收</el-checkbox>
                  <el-checkbox label="2">退货</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="接收数量" prop="receiveQuantity">
                <el-input
                  v-model="form.receiveQuantity"
                  placeholder="请输入接收数量"
                  :disabled="!checkList.includes('1')"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="退还数量" prop="refundQuantity">
                <el-input
                  v-model="form.refundQuantity"
                  placeholder="请输入退还数量"
                  :disabled="!checkList.includes('2')"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="特采编号" prop="specialNo">
              <el-input v-model="form.specialNo" placeholder="请输入特采编号" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" />
            </el-form-item>
          </el-row>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listExamineWork,
  noticeExamineWork,
  shelves,
  refund,
} from "@/api/warehouse/examineWork";
import { toNumber } from "@/utils/math"; // 精度计算
import {
  getByExamineId,
  getExamineConclusion,
  addExamineConclusion,
  updateExamineConclusion,
} from "@/api/warehouse/examineConclusion";
export default {
  name: "ExamineWorkHistory",
  dicts: ["examine_work_notice_status", "examine_status"],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 质检作业表格数据
      examineWorkList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        receiveItemDetailId: null,
        id: null,
        receiveNoticeId: null,
        itemCode: null,
        itemName: "",
        batchNo: null,
        status: null,
        statusArr: [2, 3],
        noticeDetailId: null,
        orderByColumn: "createTime",
        isAsc: "descending",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      checkList: [],
      // 是否可以上架
      isShelves: false,
      // 是否可退货
      isRefund: false,
      // 默认排序
      defaultSort: { prop: "createTime", order: "descending" },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询质检作业列表 */
    getList() {
      this.loading = true;
      listExamineWork(this.queryParams).then((response) => {
        this.examineWorkList = response.rows;
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => {
        this.isShelves = item.passQuantity > 0 && item.operateStatus !== 2;
        this.isRefund = item.failQuantity > 0 && item.operateStatus !== 3;
        return item.id;
      });
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    // 表单重置
    reset() {
      this.form = {
        id: null,
        examineId: null,
        receiveNoticeId: null,
        status: null,
        itemCode: null,
        itemName: null,
        batchNo: null,
        unit: null,
        sampleQuantity: null,
        keepQuantity: null,
        failQuantity: null,
        scrapQuantity: null,
        passQuantity: null,
        allQuantity: null,
        receiveStatus: null,
        receiveQuantity: null,
        refundQuantity: null,
        specialNo: null,
        remark: null,
      };
      (this.checkList = []), this.resetForm("form");
    },

    // 获取结论信息
    handleExaminConclusion() {
      this.reset();
      const examineId = this.ids[0];
      let rowData = {};
      this.examineWorkList.forEach((item) => {
        if (item.id === examineId) {
          rowData = item;
        }
      });
      this.setForm(rowData);
      getByExamineId(examineId).then((response) => {
        if (response.data) {
          this.form.id = response.data.id;
          this.form.receiveStatus = response.data.receiveStatus;
          this.form.receiveQuantity = response.data.receiveQuantity;
          this.form.refundQuantity = response.data.refundQuantity;
          this.form.specialNo = response.data.specialNo;
          this.form.remark = response.data.remark;
          this.checkList =
            this.form.receiveStatus == 3
              ? ["1", "2"]
              : [this.form.receiveStatus + ""];
          this.title = "修改结论";
        } else {
          this.form.examineId = examineId;
          this.title = "新增结论";
        }
        this.open = true;
      });
    },

    setForm(rowData) {
      this.form.examineId = rowData.id;
      this.form.receiveNoticeId = rowData.receiveNoticeId;
      this.form.status = rowData.status;
      this.form.itemCode = rowData.itemCode;
      this.form.itemName = rowData.itemName;
      this.form.batchNo = rowData.batchNo;
      this.form.unit = rowData.unit;
      this.form.sampleQuantity = rowData.sampleQuantity;
      this.form.keepQuantity = rowData.keepQuantity;
      this.form.failQuantity = rowData.failQuantity;
      this.form.scrapQuantity = rowData.scrapQuantity;
      this.form.passQuantity = rowData.passQuantity;
      this.form.allQuantity = rowData.allQuantity;
      this.form.sampleRefundQuantity = rowData.sampleRefundQuantity;
    },

    submitCheck() {
      if (
        this.form.receiveQuantity != "" &&
        this.form.receiveQuantity != null
      ) {
        if (this.form.receiveQuantity < 0) {
          this.$message({
            type: "error",
            message: "接收数量不能小于0",
          });
          return false;
        }

        if (this.form.receiveQuantity > this.form.allQuantity) {
          this.$message({
            type: "error",
            message: "接收数量不能大于合格数量",
          });
          return false;
        }
      }

      if (this.form.refundQuantity != "" && this.form.refundQuantity != null) {
        if (this.form.refundQuantity < 0) {
          this.$message({
            type: "error",
            message: "退还数量不能小于0",
          });
          return false;
        }
        if (this.form.refundQuantity > this.form.allQuantity) {
          this.$message({
            type: "error",
            message: "退还数量不能大于质检总数",
          });
          return false;
        }
      }

      if (
        this.form.refundQuantity != "" &&
        this.form.refundQuantity != null &&
        this.form.receiveQuantity != "" &&
        this.form.receiveQuantity != null
      ) {
        if (toNumber(this.form.receiveQuantity).add(toNumber(this.form.refundQuantity)).sub(this.form.allQuantity) > 0) {
          this.$message({
            type: "error",
            message: "接收数量+退还数量不能大于质检总数",
          });
          return false;
        }
      }
      return true;
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 提交按钮 */
    submitForm() {
      if (this.submitCheck()) {
        let params = {};
        params.receiveQuantity = this.form.receiveQuantity;
        params.refundQuantity = this.form.refundQuantity;
        params.specialNo = this.form.specialNo;
        params.remark = this.form.remark;
        params.examineId = this.form.examineId;
        params.receiveStatus = this.form.receiveStatus;
        params.id = this.form.id;
        if (this.form.id != null) {
          updateExamineConclusion(params).then((response) => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
        } else {
          addExamineConclusion(params).then((response) => {
            this.$modal.msgSuccess("新增成功");
            this.open = false;
            this.getList();
          });
        }
      }
    },

    /** 上架 */
    handleShelves() {
      if (this.ids.length === 0) {
        this.$message.warning("请选择一条数据");
        return;
      }
      var rowData = {};
      this.examineWorkList.forEach((item) => {
        if (item.id === this.ids[0]) {
          rowData = item;
        }
      });
      this.$confirm("是否上架？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          shelves(rowData).then((response) => {
            this.$message({
              type: "success",
              message: "生成上架作业成功!",
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消上架",
          });
        });
    },

    /** 退货作业 */
    handleRefund() {
      if (this.ids.length === 0) {
        this.$message.warning("请选择一条数据");
        return;
      }
      let rowData = {};
      this.examineWorkList.forEach((item) => {
        if (item.id === this.ids[0]) {
          rowData = item;
        }
      });
      let quantity = rowData.failQuantity + rowData.scrapQuantity;
      if (quantity <= 0) {
        return this.$message.warning("退货数量不能为0");
      }
      this.$confirm("是否生成退货作业？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          refund(rowData).then((response) => {
            this.$message({
              type: "success",
              message: "退货成功!",
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退货",
          });
        });
    },
    handlePrint() {
      let rowData = {};
      this.examineWorkList.forEach((item) => {
        if (item.id === this.ids[0]) {
          rowData = item;
        }
      });
      const examineWorkId = rowData.id;
      const ip = window.location.hostname;
      const port = window.location.port;
      const url = `http://${ip}:${port}/#/feedstockPrint?examineWorkId=${examineWorkId}`;
      window.open(url);
    },

    changeReceiveStatus() {
      if (this.checkList.length == 0) {
        this.form.receiveStatus = null;
        this.form.receiveQuantity = null;
        this.form.refundQuantity = null;
      } else {
        if (this.checkList.includes("1") && this.checkList.includes("2")) {
          this.form.receiveStatus = 3;
        } else if (this.checkList.includes("1")) {
          this.form.receiveStatus = 1;
          this.form.refundQuantity = null;
        } else if (this.checkList.includes("2")) {
          this.form.receiveStatus = 2;
          this.form.receiveQuantity = null;
        }
      }
    },
    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.getList();
    },
  },
};
</script>
