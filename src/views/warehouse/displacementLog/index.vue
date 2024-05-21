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
      <el-form-item label="批次号" prop="batchNo">
        <el-input
          v-model="queryParams.batchNo"
          placeholder="请输入批次号"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
      :data="displacementLogList"
      @selection-change="handleSelectionChange"
      :default-sort="defaultSort"
      @sort-change="handleSortChange"
    >
      <el-table-column label="仓库" align="center" prop="warehouseName" />
      <el-table-column
        label="原库位"
        align="center"
        prop="originalLocationName"
      />
      <el-table-column
        label="目标库位"
        align="center"
        prop="targetLocationName"
      />
      <el-table-column
        label="物料编码"
        align="center"
        width="260"
        prop="itemCode"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      />
      <el-table-column
        label="物料名称"
        align="center"
        width="260"
        :show-overflow-tooltip="true"
        prop="itemName"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      />
      <el-table-column
        label="批次号"
        align="center"
        prop="batchNo"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      />
      <el-table-column label="数量" align="center" prop="quantity" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="规格" align="center" prop="spec" />
      <el-table-column label="操作人" align="center" prop="createUserName" />
      <el-table-column
        label="操作时间"
        align="center"
        prop="createTime"
        width="180"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.createTime, "{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
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
  </div>
</template>

<script>
import { listDisplacementLog } from "@/api/warehouse/displacementLog";

export default {
  name: "DisplacementLog",
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
      // 移位日志表格数据
      displacementLogList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        warehouseId: null,
        itemCode: null,
        itemName: null,
        batchNo: null,
        quantity: null,
        originalLocation: null,
        targetLoaction: null,
        createUser: null,
        orderByColumn: "createTime",
        isAsc: "descending",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      // 默认排序
      defaultSort: { prop: "createTime", order: "descending" },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询移位日志列表 */
    getList() {
      this.loading = true;
      listDisplacementLog(this.queryParams).then((response) => {
        this.displacementLogList = response.rows;
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
        warehouseId: null,
        itemCode: null,
        itemName: null,
        batchNo: null,
        quantity: null,
        originalLocation: null,
        targetLoaction: null,
        createUser: null,
        createTime: null,
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
    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.detailTableQueryParams.orderByColumn = column.prop;
      this.detailTableQueryParams.isAsc = column.order;
      this.getReceiveNoticeDetailList();
    },
  },
};
</script>
