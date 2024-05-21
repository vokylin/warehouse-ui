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
      <el-form-item label="出库通知单号" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入出库通知单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="业务系统单号" prop="businessId">
        <el-input
          v-model="queryParams.businessId"
          placeholder="请输入业务系统单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单据类型" prop="businessType">
        <el-select
          v-model="queryParams.businessType"
          placeholder="请选择单据类型"
          clearable
          @change="handleQuery"
        >
          <el-option
            v-for="dict in dict.type.business_type_delivery"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="收货开始时间" prop="startTime">
        <el-date-picker
          clearable
          v-model="queryParams.startTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择收货开始时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="收货完成时间" prop="endTime">
        <el-date-picker
          clearable
          v-model="queryParams.endTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择收货完成时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="通知时间" prop="noticeTime">
        <el-date-picker
          clearable
          v-model="queryParams.noticeTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择通知时间"
        >
        </el-date-picker>
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
          type="success"
          plain
          icon="el-icon-check"
          size="mini"
          :disabled="activeDisabled"
          @click="handleActive"
          v-hasPermi="['warehouse:deliveryNotice:active']"
          >激活</el-button
        >
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-close"
          size="mini"
          :disabled="inactiveDisabled"
          @click="handleInactive"
          v-hasPermi="['warehouse:deliveryNotice:inactive']"
          >反激活</el-button
        >
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="cancelDisabled"
          @click="handleInvalid"
          v-hasPermi="['warehouse:deliveryNotice:invalid']"
          >作废</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="deliveryNoticeList"
      @selection-change="handleSelectionChange"
      :default-sort="defaultSort"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="出库通知编号"
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
        label="业务系统单号"
        width="180"
        align="center"
        prop="businessId"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
      </el-table-column>
      <el-table-column
        label="单据类型"
        align="center"
        width="120"
        prop="businessType"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.business_type_delivery"
            :value="scope.row.businessType"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="收发类型"
        align="center"
        width="240"
        prop="receiveSendType"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.delivery_type"
            :value="scope.row.receiveSendType"
          />
        </template>
      </el-table-column>
      <!-- <el-table-column label="发货货位" align="center" prop="locationId" /> -->
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.delivery_notice_status"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="发货开始时间"
        align="center"
        prop="deliveryStartTime"
        width="180"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.deliveryStartTime, "{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="发货完成时间"
        align="center"
        prop="deliveryEndTime"
        width="180"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.deliveryEndTime, "{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="通知人" align="center" prop="noticeUser" />
      <el-table-column
        label="收货方编码"
        width="120"
        align="center"
        prop="toCode"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      />
      <el-table-column
        label="收货方名称"
        width="260"
        align="center"
        prop="toName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="收货方联系人"
        width="120"
        align="center"
        prop="toContacts"
      />
      <el-table-column
        label="联系电话"
        align="center"
        width="120"
        prop="toContactsTel"
      />
      <el-table-column
        label="联系地址"
        align="center"
        width="180"
        prop="toAddress"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="通知说明"
        align="center"
        width="180"
        prop="noticeDesc"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="温层"
        align="center"
        prop="thermosphere"
        width="180"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.thermosphere"
            :value="scope.row.thermosphere"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="通知时间"
        align="center"
        width="180"
        prop="createTime"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.createTime, "{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="240">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetail(scope.row)"
            v-hasPermi="['warehouse:deliveryNotice:detail']"
            >详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-sort"
            @click="handleManualAllocation(scope.row)"
            v-if="scope.row.status === 1"
            v-hasPermi="['warehouse:deliveryNotice:manualAllocation']"
            >手动分配</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-check"
            @click="handleGeneratePickWorkOrder(scope.row)"
            v-hasPermi="['warehouse:deliveryNotice:pickWork']"
            v-if="scope.row.status === 1"
            >生成作业单</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-check"
            @click="handleDeliveryConfirm(scope.row)"
            v-hasPermi="['warehouse:deliveryNotice:deliveryConfirm']"
            v-if="scope.row.status === 1"
            >出库确认</el-button
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

    <el-dialog
      title="激活"
      :visible.sync="activeVisible"
      width="400px"
      append-to-body
    >
      <el-form
        ref="activeForm"
        :model="activeForm"
        :rules="activeRules"
        label-width="120px"
      >
        <el-form-item label="出库时间" prop="deliveryStartTime">
          <el-date-picker
            clearable
            v-model="activeForm.deliveryStartTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择出库时间"
            :picker-options="pickerBeginDateBefore"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="温层" prop="thermosphere">
          <el-select
            v-model="activeForm.thermosphere"
            placeholder="请选择温层"
            clearable
          >
            <el-option
              v-for="dict in dict.type.thermosphere"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="收发类别" prop="receiveSendType">
          <el-select
            v-model="activeForm.receiveSendType"
            placeholder="请选择收发类别"
            clearable
            filterable
          >
            <el-option
              v-for="dict in dict.type.delivery_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="activeSubmitForm">确 定</el-button>
        <el-button @click="activeCancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 详情入库通知对话框 -->
    <detail ref="detail" />

    <!-- 手动分配对话框 -->
    <manual-allocation ref="manualAllocation" @refreshTable="refreshTable" />

    <delivery-confirm ref="deliveryConfirm" @refreshTable="refreshTable" />
  </div>
</template>

<script>
import {
  listDeliveryNotice,
  getDeliveryNotice,
  activeDeliveryNotice,
  inactiveDeliveryNotice,
  cancelDeliveryNotice,
  generatePickWork,
  getCheckOutMonth
} from "@/api/warehouse/deliveryNotice";
import detail from "./components/detail";
import manualAllocation from "./components/manualAllocation";
import deliveryConfirm from "./components/deliveryConfirm";
export default {
  dicts: [
    "delivery_notice_status",
    "thermosphere",
    "delivery_type",
    "receive_type",
    "business_type_delivery",
  ],
  name: "deliveryNotice",
  components: {
    detail,
    manualAllocation,
    deliveryConfirm,
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
      // 激活按钮禁用
      activeDisabled: true,
      // 取消激活按钮禁用
      inactiveDisabled: true,
      // 作废按钮禁用
      cancelDisabled: true,
      // 总条数
      total: 0,
      // 入库通知表格数据
      deliveryNoticeList: [],
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
        id: null,
        statusArr: [0, 1, 5],
        startTime: null,
        endTime: null,
        noticeUser: null,
        noticeTime: null,
        supplierId: null,
        orderByColumn: "createTime",
        isAsc: "ascending",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      // 激活弹出层
      activeVisible: false,
      activeForm: {},
      activeRules: {
        thermosphere: [
          { required: true, message: "请选择温层", trigger: "change" },
        ],
        deliveryStartTime: [
          { required: true, message: "请选择出库时间", trigger: "change" },
        ],
        receiveSendType: [
          { required: true, message: "请选择收发类别", trigger: "change" },
        ],
      },
      // 默认排序
      defaultSort: { prop: "createTime", order: "descending" },
      selectStartTime: '',
      pickerBeginDateBefore: {
        disabledDate: time => {
          if (this.selectStartTime) {
            return time.getTime() < new Date(this.selectStartTime).getTime()
          }
        }
      }
    };
  },
  created() {
    this.getCheckOutMonth()
    this.getList();
  },
  methods: {
    /** 查询入库通知列表 */
    getList() {
      this.loading = true;
      listDeliveryNotice(this.queryParams).then((response) => {
        this.deliveryNoticeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 获取月结的月份 */
    getCheckOutMonth() {
      getCheckOutMonth().then((response) => {
        this.selectStartTime = response.msg || ''
      })
    },
    // 刷新表格
    refreshTable() {
      this.getList();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.activeForm = {
        id: null,
        deliveryStartTime: null,
        thermosphere: null,
        receiveSendType: null,
      };
      this.resetForm("activeForm");
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
      this.activeDisabled = selection.some((item) => item.status !== 0);
      this.inactiveDisabled = selection.some((item) => item.status !== 1);
      this.cancelDisabled = selection.some((item) => item.status !== 0);
    },

    /** 详情按钮操作 */
    handleDetail(row) {
      this.$refs.detail.getList(row);
    },
    /** 激活按钮操作 */
    handleActive() {
      if (this.ids == null || this.ids.length == 0) {
        this.$modal.msgWarning("请选择要激活的入库通知");
        return;
      }
      this.activeVisible = true;
    },
    /** 激活提交按钮 */
    activeSubmitForm() {
      this.$refs["activeForm"].validate((valid) => {
        if (valid) {
          this.activeForm.id = this.ids[0];
          activeDeliveryNotice(this.activeForm).then((response) => {
            this.$modal.msgSuccess("修改成功");
            this.activeVisible = false;
            this.activeForm = {};
            this.getList();
          });
        }
      });
    },

    /** 反激活按钮 */
    handleInactive() {
      if (this.ids == null || this.ids.length == 0) {
        this.$modal.msgWarning("请选择要反激活的入库通知");
        return;
      }
      this.$modal
        .confirm("是否确认反激活？")
        .then(function () {
          return;
        })
        .then(() => {
          inactiveDeliveryNotice({ id: this.ids[0] }).then((response) => {
            this.$modal.msgSuccess("反激活成功");
            this.getList();
          });
        })
        .catch(() => {});
    },

    /**激活取消按钮 */
    activeCancel() {
      this.activeVisible = false;
    },
    /**手动分配 */
    handleManualAllocation(row) {
      this.$refs.manualAllocation.start(row);
    },
    /** 取消分配 */
    handleCancelAllocation(row) {
      this.$modal
        .confirm("是否确认取消分配？")
        .then(function () {
          return;
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("取消分配成功");
        })
        .catch(() => {});
    },
    /** 作废 */
    handleInvalid() {
      if (this.ids == null || this.ids.length == 0) {
        this.$modal.msgWarning("请选择要作废的入库通知");
        return;
      }
      var rowData = this.deliveryNoticeList.find(
        (item) => item.id === this.ids[0]
      );
      this.$modal
        .confirm("是否确认作废？")
        .then(function () {
          return;
        })
        .then(() => {
          cancelDeliveryNotice(rowData).then((response) => {
            this.$modal.msgSuccess("作废成功");
            this.getList();
          });
        })
        .catch(() => {});
    },
    /** 生成作业单 */
    handleGeneratePickWorkOrder(row) {
      this.$modal
        .confirm("是否确认生成作业单？")
        .then(function () {
          return;
        })
        .then(() => {
          this.$modal.loading("正在生成作业单...");
          generatePickWork(row)
            .then((response) => {
              this.$modal.msgSuccess("生成作业单成功");
              this.$modal.closeLoading();
              this.getList();
            })
            .catch(() => {
              this.$modal.closeLoading();
            });
        });
    },
    /** 出库确认 */
    handleDeliveryConfirm(row) {
      this.$refs.deliveryConfirm.getList(row);
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
