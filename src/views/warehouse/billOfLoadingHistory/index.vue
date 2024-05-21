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
      <el-form-item label="发货通知单号" prop="deliveryNoticeId">
        <el-input
          v-model="queryParams.deliveryNoticeId"
          placeholder="请输入发货通知单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="业务单号" prop="businessId">
        <el-input
          v-model="queryParams.businessId"
          placeholder="请输入业务单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="物流单号信息" prop="logisticsNo">
        <el-input
          v-model="queryParams.logisticsNo"
          placeholder="请输入物流单号信息"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
       <el-form-item label="单据类型" prop="businessType">
        <el-select
          v-model="queryParams.businessType"
          placeholder="请选择单据类型"
          clearable
        >
          <el-option
            v-for="dict in dict.type.business_type_delivery"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发运时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
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
          icon="el-icon-document"
          size="mini"
          :disabled="single"
          @click="handleDetail"
          v-hasPermi="['system:billOfLoadingHistory:detail']"
          >查看详情</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="loadingList"
      @selection-change="handleSelectionChange"
      :default-sort="defaultSort"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="发货通知单号"
        align="center"
        prop="deliveryNoticeId"
        width="180"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template slot-scope="scope">
          <el-link
            :underline="false"
            type="primary"
            @click="handleDetailRow(scope.row)"
            >{{ scope.row.id }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column
        label="业务单号"
        align="center"
        width="180"
        prop="businessId"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      />
      <el-table-column
        label="单据类型"
        width="180"
        align="center"
        prop="businessType"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.business_type_delivery"
            :value="scope.row.businessType"
          />
        </template>
      </el-table-column>
      <el-table-column label="计划数量" align="center" prop="planQuantity" />
      <el-table-column label="实际数量" align="center" prop="quantity" />
      <el-table-column label="运费（元）" align="center" prop="fare" width="140" />
      <el-table-column
        label="客户名称"
        width="280"
        align="center"
        prop="customerName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="客户编码"
        width="180"
        align="center"
        prop="customerCode"
      />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.bill_of_loading_status"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="计划发运时间"
        align="center"
        prop="planDeliveryTime"
        width="180"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.planDeliveryTime, "{y}-{m}-{d} {h}:{m}:{s}")
          }}</span>
        </template>
      </el-table-column>
    -->
      <el-table-column
        label="发运时间"
        align="center"
        prop="deliveryDate"
        width="180"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.deliveryDate, "{y}-{m}-{d}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="发运承运商"
        width="180"
        align="center"
        prop="logisticsName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="承运人信息"
        align="center"
        prop="carriersConcat"
        width="180"
      />
      <el-table-column label="车辆信息" width="120" align="center" prop="carInfo" />
      <el-table-column
        label="物流单号信息"
        width="180"
        align="center"
        prop="logisticsNo"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      />
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 详情对话框 -->
    <detail ref="detail" />
  </div>
</template>

<script>
import {
  listLoading,
  getLoading,
  delLoading,
  addLoading,
  updateLoading,
} from "@/api/warehouse/billOfLoading";
import detail from "../billOfLoading/components/detail";
import { listLogistics } from "@/api/system/logistics";
export default {
  dicts: ["bill_of_loading_status", "delivery_type", "business_type_delivery"],
  name: "Loading",
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
      // 发运单表格数据
      loadingList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deliveryNoticeId: null,
        businessId: null,
        businessType: null,
        companyId: null,
        customerId: null,
        status: 1,
        carriersId: null,
        carriersConcat: null,
        logisticsNo: null,
        orderByColumn: "deliveryDate",
        isAsc: "descending",
        startDate: null,
        endDate: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        carriersId: [
          { required: true, message: "请选择发运承运商", trigger: "blur" },
        ],
        logisticsNo: [
          { required: true, message: "请输入物流单号信息", trigger: "blur" },
        ],
      },
      // 承运商列表
      logisticsList: [],
      // 默认排序
      defaultSort: { prop: "deliveryDate", order: "descending" },
      // 日期范围
      dateRange: [],
    };
  },
  created() {
    this.getList();
    this.getLogisticsList();
  },
  methods: {
    /** 查询发运单列表 */
    getList() {
      this.loading = true;
      listLoading(this.queryParams).then((response) => {
        this.loadingList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 查询承运商列表 */
    getLogisticsList() {
      listLogistics().then((response) => {
        this.logisticsList = response.rows;
      });
    },

    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.getList();
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.queryParams.startDate = null;
      this.queryParams.endDate = null;
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
    handleDetail() {
      if (this.ids.length > 1) {
        this.$modal.msgWarning("只能选择一条数据");
        return;
      }
      var rowData = {};
      this.loadingList.forEach((item) => {
        if (item.id == this.ids[0]) {
          rowData = item;
        }
      });

      this.$refs.detail.getList(rowData);
    },

    handleDetailRow(row) {
      this.$refs.detail.getList(row);
    },

    // 日期范围
    changeDateRange(val) {
      if (val) {
        this.queryParams.startDate = val[0];
        this.queryParams.endDate = val[1];
      } else {
        this.queryParams.startDate = null;
        this.queryParams.endDate = null;
      }
      this.getList();
    },
  },
};
</script>
