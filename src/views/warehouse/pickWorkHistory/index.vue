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
      <el-form-item label="拣货通知编号" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入拣货通知编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="出库通知编号" prop="noticeId">
        <el-input
          v-model="queryParams.noticeId"
          placeholder="请输入出库通知编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收发类型" prop="receiveSendType">
        <el-select
          v-model="queryParams.receiveSendType"
          placeholder="请选择收发类型"
          clearable
        >
          <el-option
            v-for="dict in dict.type.delivery_type"
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

    <el-table
      v-loading="loading"
      :data="workNoticeList"
      @selection-change="handleSelectionChange"
      :default-sort="defaultSort"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="拣货通知编号"
        width="180"
        align="center"
        prop="id"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
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
        label="出库通知编号"
        width="180"
        align="center"
        prop="noticeId"
      />
      <el-table-column
        label="收发类型"
        align="center"
        prop="receiveSendType"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.delivery_type"
            :value="scope.row.receiveSendType"
          />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.pick_work_notice_status"
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
      <el-table-column label="操作" align="center" fixed="right" width="80">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetail(scope.row)"
            v-hasPermi="['warehouse:pickWorkHistory:detail']"
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
import detail from "../pickWork/components/detail";
export default {
  dicts: [
    "thermosphere",
    "pick_work_notice_status",
    "delivery_type",
    "work_type",
  ],
  components: {
    detail,
  },
  name: "ReceiveNotice",
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
        type: 1,
        companyId: null,
        id: null,
        statusArr: [2, 3],
        orderByColumn: "workEndTime",
        isAsc: "descending",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      // 默认排序
      defaultSort: { prop: "workEndTime", order: "descending" },
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
  },
};
</script>
