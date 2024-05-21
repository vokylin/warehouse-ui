<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="100px"
    >
      <el-form-item label="上架作业编号" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入上架作业编号号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="入库通知单号" prop="noticeId" label-width="120px">
        <el-input
          v-model="queryParams.noticeId"
          placeholder="请输入入库通知单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
       <el-form-item label="收发类别" prop="receiveSendType">
        <el-select
          v-model="queryParams.receiveSendType"
          placeholder="请选择收发类别"
          clearable
        >
          <el-option
            v-for="dict in dict.type.receive_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
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
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="workNoticeList"
      @selection-change="handleSelectionChange"
      :default-sort="defaultSort"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="上架作业编号"
        width="160"
        align="center"
        prop="id"
      >
        <template slot-scope="scope">
          <el-link
            :underline="false"
            type="primary"
            @click="handleDetail(scope.row)"
            >{{ scope.row.id }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column
        label="入库通知单号"
        width="160"
        align="center"
        prop="noticeId"
      />
      <el-table-column label="收发类型" align="center" prop="receiveSendType">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.receive_type"
            :value="scope.row.receiveSendType"
          />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.shelf_work_notice_status"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="作业开始时间"
        align="center"
        prop="workStartTime"
        width="180"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.workStartTime, "{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="作业完成时间"
        align="center"
        prop="workEndTime"
        width="180"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.workEndTime, "{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="100">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetail(scope.row)"
            v-hasPermi="['warehouse:shelfWorkNotice:detail']"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 作业通知详情对话框 -->
    <detail ref="detail" />
  </div>
</template>

<script>
import { listWorkNotice } from "@/api/warehouse/workNotice";

import detail from "../shelfWorkNotice/components/detail";
export default {
  dicts: [
    "thermosphere",
    "shelf_work_notice_status",
    "receive_type",
    "work_type",
  ],
  name: "ReceiveNoticeHistory",
  components: {
    detail,
  },
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
      // 入库通知表格数据
      workNoticeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        businessId: null,
        businessType: null,
        noticeDesc: null,
        companyId: null,
        status: 2,
        type: 0,
        startTime: null,
        endTime: null,
        noticeUser: null,
        noticeTime: null,
        supplierId: null,
        orderByColumn: "createTime",
        isAsc: "desc",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      // 激活弹出层
      activeVisible: false,
      activeForm: {},
      activeRules: {
        startTime: [
          {
            required: true,
            message: "请选择收货开始时间",
            trigger: "blur",
          },
        ],
      },
      // 默认排序
      defaultSort: { prop: "createTime", order: "descending" },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询入库通知列表 */
    getList() {
      this.loading = true;
      listWorkNotice(this.queryParams).then((response) => {
        this.workNoticeList = response.rows;
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
        businessId: null,
        businessType: null,
        noticeDesc: null,
        companyId: null,
        status: null,
        startTime: null,
        endTime: null,
        noticeUser: null,
        noticeTime: null,
        supplierId: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    /** 详情按钮操作 */
    handleDetail(row) {
      this.$refs.detail.getList(row);
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
