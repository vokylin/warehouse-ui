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
          type="primary"
          plain
          size="mini"
          @click="handleNotice"
          v-hasPermi="['warehouse:examineWork:notice']"
          :disabled="single || isNotice"
          >通知质检</el-button
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
      <el-table-column
        label="入库通知单号"
        width="180"
        align="center"
        prop="receiveNoticeId"
      />
      <el-table-column
        label="通知状态"
        align="center"
        prop="operateStatus"
        width="120"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.examine_work_notice_status"
            :value="scope.row.operateStatus"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="物料编码"
        width="180"
        align="center"
        prop="itemCode"
      />
      <el-table-column
        label="物料名称"
        width="180"
        align="center"
        prop="itemName"
        show-overflow-tooltip
      />
      <el-table-column
        label="物料批次"
        width="180"
        align="center"
        prop="batchNo"
      />
      <el-table-column
        label="质检总数"
        align="center"
        prop="allQuantity"
        width="120"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="160"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      />
      <!--      <el-table-column
        label="质检状态"
        align="center"
        prop="status"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.examine_status"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>-->
      <!-- <el-table-column
        label="抽样数量"
        align="center"
        prop="sampleQuantity"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      />
      <el-table-column
        label="留样数量"
        align="center"
        prop="keepQuantity"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      />
      <el-table-column
        label="不合格数"
        align="center"
        prop="failQuantity"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      />
      <el-table-column
        label="报废数量"
        align="center"
        prop="scrapQuantity"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      />
      <el-table-column
        label="合格数量"
        align="center"
        prop="passQuantity"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      />-->

      <!-- <el-table-column label="修改人" align="center" prop="updateUp" /> -->
      <!-- <el-table-column label="公司ID" align="center" prop="companyId" /> -->
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import {
  listExamineWork,
  noticeExamineWork,
} from "@/api/warehouse/examineWork";

export default {
  name: "ExamineWork",
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
        receiveNoticeId: null,
        itemCode: null,
        batchNo: null,
        status: null,
        id: null,
        statusArr: [0, 1],
        sampleQuantity: null,
        keepQuantity: null,
        failQuantity: null,
        scrapQuantity: null,
        passQuantity: null,
        allQuantity: null,
        examineBy: null,
        examineManager: null,
        updateUp: null,
        operateStatus: null,
        companyId: null,
        checkType: null,
        noticeDetailId: null,
        orderByColumn: "createTime",
        isAsc: "descending",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      // 通知按钮
      isNotice: false,
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        receiveItemDetailId: null,
        receiveNoticeId: null,
        itemCode: null,
        batchNo: null,
        status: null,
        sampleQuantity: null,
        keepQuantity: null,
        failQuantity: null,
        scrapQuantity: null,
        passQuantity: null,
        allQuantity: null,
        examineBy: null,
        examineManager: null,
        createBy: null,
        createTime: null,
        updateUp: null,
        updateTime: null,
        operateStatus: null,
        companyId: null,
        checkType: null,
        noticeDetailId: null,
      };
      this.resetForm("form");
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
        this.isNotice = item.operateStatus === 1;
        return item.id;
      });
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    /** 通知质检 */
    handleNotice() {
      if (this.ids.length === 0) {
        this.$message.warning("请选择一条数据");
        return;
      }
      this.$confirm("是否通知质检？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          noticeExamineWork({ ids: this.ids }).then((response) => {
            this.$message({
              type: "success",
              message: "通知成功!",
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消通知",
          });
        });
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
