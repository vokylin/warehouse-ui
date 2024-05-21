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
      <el-form-item label="仓库" prop="warehouseId">
        <el-select
          v-model="queryParams.warehouseId"
          placeholder="请选择仓库"
          clearable
          size="mini"
          @change="getList"
        >
          <el-option
            v-for="item in warehouseList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择类型"
          clearable
          size="mini"
          @change="getList"
        >
          <el-option
            v-for="item in dict.type.storage_in_out_record_type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
      <el-form-item label="通知编号" prop="noticeId">
        <el-input
          v-model="queryParams.noticeId"
          placeholder="请输入通知编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changeDateRange"
        ></el-date-picker>
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
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['warehouse:storageInOutRecord:export']"
        >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>
    <el-table
      v-loading="loading"
      :data="storageInOutRecordList"
      @selection-change="handleSelectionChange"
      :default-sort="defaultSort"
      @sort-change="handleSortChange"
    >
      <el-table-column
        label="仓库"
        align="center"
        width="180"
        prop="warehouseName"
      />
      <el-table-column
        label="库位"
        align="center"
        width="180"
        prop="locationName"
      />
      <el-table-column
        label="物料编码"
        align="center"
        width="180"
        prop="itemCode"
      />
      <el-table-column
        label="物料名称"
        align="center"
        width="240"
        prop="itemName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="物料批次"
        align="center"
        width="180"
        prop="batchNo"
      />
      <el-table-column label="数量" align="center" prop="quantity" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column
        label="规格型号"
        align="center"
        width="120"
        prop="spec"
      />
      <el-table-column label="类型" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.storage_in_out_record_type"
            :value="scope.row.type"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="单据说明"
        align="center"
        width="140"
        prop="noticeDesc"
      />
      <el-table-column
        label="备注"
        align="center"
        width="140"
        prop="remark"
      />
      <el-table-column
        label="业务编号"
        width="180"
        align="center"
        prop="businessNo"
      />
      <el-table-column
        label="通知编码"
        width="180"
        align="center"
        prop="noticeId"
      />
      <el-table-column
        label="发生时间"
        align="center"
        prop="occTime"
        width="180"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
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
import { listStorageInOutRecord } from "@/api/warehouse/storageInOutRecord";
import { getWarehouseList } from "@/api/system/warehouse";
export default {
  dicts: ["storage_in_out_record_type"],
  name: "StorageInOutRecord",
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
      // 出入库记录表格数据
      storageInOutRecordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyId: null,
        itemCode: null,
        itemName: null,
        batchNo: null,
        type: null,
        businessNo: null,
        occTime: null,
        noticeId: null,
        beginTime: null,
        endTime: null,
        orderByColumn: "createTime",
        isAsc: "descending",
      },
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      // 仓库下拉框数据
      warehouseList: [],
      // 默认排序
      defaultSort: { prop: "createTime", order: "descending" },
    };
  },
  created() {
    this.getList();
    this.getWarehouseList();
  },
  methods: {
    /** 查询出入库记录列表 */
    getList() {
      this.loading = true;
      const endTime = this.queryParams.endTime
      if (endTime && endTime.indexOf(" 59:59:59") === -1) {
        this.queryParams.endTime = endTime + ' 59:59:59'
      }

      listStorageInOutRecord(this.queryParams).then((response) => {
        this.storageInOutRecordList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.getList();
    },
    // 日期范围
    changeDateRange(val) {
      if (val) {
        this.queryParams.beginTime = val[0];
        this.queryParams.endTime = val[1];
      } else {
        this.queryParams.beginTime = null;
        this.queryParams.endTime = null;
      }
      this.getList();
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.dateRange = [];
      this.resetForm("form");
    },
    /** 获取仓库下拉框数据 */
    getWarehouseList() {
      getWarehouseList().then((response) => {
        this.warehouseList = response.data;
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
      this.queryParams.beginTime = null;
      this.queryParams.endTime = null;
      this.dateRange = [];
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "warehouse/storageInOutRecord/export",
        {
          ...this.queryParams,
        },
        `出入库记录_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
