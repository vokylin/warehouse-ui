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
          :disabled="multiple"
          @click="handleDetail"
          v-hasPermi="['warehouse:billOfLoading:detail']"
          >查看详情</el-button
        >
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-check"
          size="mini"
          :disabled="multiple"
          @click="handleConfirm"
          v-hasPermi="['warehouse:billOfLoading:finish']"
          >发运完成</el-button
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
        label="发运通知单号"
        align="center"
        prop="id"
        width="150"
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
        label="出库通知单号"
        align="center"
        prop="deliveryNoticeId"
        width="150"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
      </el-table-column>
      <el-table-column
        label="业务单号"
        width="140"
        align="center"
        prop="businessId"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      />
      <el-table-column
        label="单据类型"
        width="140"
        align="center"
        prop="businessType"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
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
      <el-table-column label="运费" align="center" prop="fare" width="140" />
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
      <el-table-column
        label="实际发运时间"
        align="center"
        prop="deliveryTime"
        width="180"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.deliveryTime, "{y}-{m}-{d} {h}:{m}:{s}")
          }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="发运承运商"
        width="180"
        align="center"
        prop="logisticsName"
      />
      <el-table-column
        label="承运人信息"
        align="center"
        prop="carriersConcat"
        width="180"
      />
      <el-table-column label="车辆信息" align="center" prop="carInfo" />
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

    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="发货通知单号" prop="id">
          <el-input
            v-model="form.id"
            placeholder="请输入发货通知单号"
            disabled
          />
        </el-form-item>
        <el-form-item label="发运承运商" prop="carriersId">
          <el-select
            v-model="form.carriersId"
            placeholder="请选择发运承运商"
            style="width: 100%"
          >
            <el-option
              v-for="item in logisticsList"
              :key="item.id"
              :label="item.logisticsName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="承运人信息" prop="carriersConcat">
          <el-input
            v-model="form.carriersConcat"
            placeholder="请输入承运人信息"
          />
        </el-form-item>
        <el-form-item label="车辆信息" prop="carInfo">
          <el-input v-model="form.carInfo" placeholder="请输入车辆信息" />
        </el-form-item>
        <el-form-item label="物流单号信息" prop="logisticsNo">
          <el-input
            v-model="form.logisticsNo"
            placeholder="请输入物流单号信息"
          />
        </el-form-item>
        <el-form-item label="运费" prop="fare">
          <el-input v-model="form.fare" placeholder="请输入运费" />
        </el-form-item>
        <el-form-item label="发运时间" prop="deliveryDate">
          <el-date-picker
            v-model="form.deliveryDate"
            type="datetime"
            placeholder="请选择发运时间"
            style="width: 100%"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 详情对话框 -->
    <detail ref="detail" />
  </div>
</template>

<script>
import { listLoading, delLoading, finish } from "@/api/warehouse/billOfLoading";

import { listLogistics } from "@/api/system/logistics";
import detail from "./components/detail";
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
        status: 0,
        carriersId: null,
        carriersConcat: null,
        logisticsNo: null,
        orderByColumn: "createDate",
        isAsc: "ascending",
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
        fare: [
          { required: true, message: "请输入运费", trigger: "blur" },
          {
            pattern: /^[0-9]+([.]{1}[0-9]{1,6})?$/,
            message: "请输入正确的运费,最多保留6位小数",
            trigger: "blur",
          },
        ],
        deliveryDate: [
          { required: true, message: "请选择发运时间", trigger: "blur" },
        ],
      },
      // 承运商列表
      logisticsList: [],
      // 默认排序
      defaultSort: { prop: "createDate", order: "descending" },
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
      this.detailTableQueryParams.orderByColumn = column.prop;
      this.detailTableQueryParams.isAsc = column.order;
      this.getReceiveNoticeDetailList();
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
        deliveryNoticeId: null,
        businessId: null,
        businessType: null,
        companyId: null,
        planQuantity: null,
        quantity: null,
        customerId: null,
        status: null,
        deliveryDate: null,
        carriersId: null,
        carriersConcat: null,
        carInfo: null,
        logisticsNo: null,
        fare: null,
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
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$modal.loading("发运中...");
          finish(this.form)
            .then((response) => {
              this.$modal.closeLoading();
              this.$modal.msgSuccess("发运完成");
              this.open = false;
              this.getList();
            })
            .catch(() => {
              this.$modal.closeLoading();
            });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除发运单编号为"' + ids + '"的数据项？')
        .then(function () {
          return delLoading(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },

    /** 发运完成 */
    handleConfirm() {
      this.reset();
      var rowData = this.loadingList.filter((item) => {
        return item.id == this.ids[0];
      });
      this.form.id = rowData[0].id;
      this.form.deliveryNoticeId = rowData[0].deliveryNoticeId;
      this.open = true;
      this.title = "发运信息补充";
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/loading/export",
        {
          ...this.queryParams,
        },
        `loading_${new Date().getTime()}.xlsx`
      );
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
  },
};
</script>
