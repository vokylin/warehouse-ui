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
      <el-form-item label="收货单号" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入收货单号"
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
          filterable
        >
          <el-option
            v-for="dict in dict.type.business_type_receive"
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
          type="primary"
          plain
          icon="el-icon-circle-check"
          size="mini"
          :disabled="active || single"
          @click="handleActive"
          v-hasPermi="['warehouse:receiveNotice:active']"
          >激活</el-button
        >
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="default"
          plain
          icon="el-icon-circle-close"
          size="mini"
          :disabled="inactive || single"
          @click="handleInactive"
          v-hasPermi="['warehouse:receiveNotice:inactive']"
          >反激活</el-button
        >
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="single || active"
          @click="handleInvalid"
          v-hasPermi="['warehouse:receiveNotice:invalid']"
          >作废</el-button
        >
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-check "
          size="mini"
          :disabled="single"
          @click="handleConfirm"
          v-hasPermi="['warehouse:receiveNotice:confirm']"
          >收货确认</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="wmsReceiveNoticeList"
      @selection-change="handleSelectionChange"
      :default-sort="defaultSort"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="收货单号" width="180" align="center" prop="id">
        <template slot-scope="scope">
          <el-link
            :underline="false"
            type="primary"
            @click="handleDetail(scope.row)"
            >{{ scope.row.id }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column label="通知状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.recive_notice_status"
            :value="scope.row.status"
          />
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
        <template slot-scope="scope">
          <span>{{ scope.row.businessId ? scope.row.businessId : "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="单据类型"
        align="center"
        prop="businessType"
        width="180"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.businessType == null">-</span>
          <dict-tag
            v-else
            :options="dict.type.business_type_receive"
            :value="scope.row.businessType"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="收发类别"
        align="center"
        prop="receiveSendType"
        width="180"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.receiveSendType == null">-</span>
          <dict-tag
            v-else
            :options="dict.type.receive_type"
            :value="scope.row.receiveSendType"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="发出方名称"
        width="240"
        align="center"
        prop="fromName"
        :show-overflow-tooltip="true"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.fromName ? scope.row.fromName : "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="发出方编码"
        width="180"
        align="center"
        prop="fromCode"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.fromCode ? scope.row.fromCode : "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="通知人" align="center" prop="noticeUser" />
      <el-table-column
        label="通知时间"
        align="center"
        prop="noticeTime"
        width="180"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.noticeTime
              ? parseTime(scope.row.noticeTime, "{y}-{m}-{d} {h}:{i}:{s}")
              : "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="单据说明"
        align="center"
        width="120"
        prop="noticeDesc"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.noticeDesc ? scope.row.noticeDesc : "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="收货开始时间"
        align="center"
        prop="startTime"
        width="180"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.startTime
              ? parseTime(scope.row.startTime, "{y}-{m}-{d} {h}:{i}:{s}")
              : "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="收货完成时间"
        align="center"
        prop="endTime"
        width="180"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.endTime
              ? parseTime(scope.row.endTime, "{y}-{m}-{d} {h}:{i}:{s}")
              : "-"
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
            v-hasPermi="['warehouse:receiveNotice:detail']"
            >详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-check"
            @click="handleReceipt(scope.row)"
            v-if="scope.row.status == '1'"
            v-hasPermi="['warehouse:receiveNotice:receipt']"
            >收货</el-button
          >
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.status == '1'"
            icon="el-icon-check"
            @click="handleBatchReceipt(scope.row)"
            v-hasPermi="['warehouse:receiveNotice:shelves']"
            >上架</el-button
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
        <el-form-item label="收货开始时间" prop="startTime">
          <el-date-picker
            clearable
            v-model="activeForm.startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择收货开始时间"
            :picker-options="pickerBeginDateBefore"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="收发类别" prop="receiveSendType">
          <el-select
            v-model="activeForm.receiveSendType"
            placeholder="请选择收发类别"
          >
            <el-option
              v-for="item in dict.type.receive_type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
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

    <!-- 收货入库通知对话框 -->
    <receipt ref="receipt" @refreshTable="refreshTable" />

    <!-- 上架对话框 -->
    <batch-receipt ref="batchReceipt" @refreshTable="refreshTable" />
  </div>
</template>

<script>
import {
  listWmsReceiveNotice,
  getWmsReceiveNotice,
  activeWmsReceiveNotice,
  inactiveWmsReceiveNotice,
  receiveConfirm,
  invalidNotice,
  getCheckOutMonth
} from "@/api/warehouse/receiveNotice";
import detail from "./components/detail";
import receipt from "./components/receipt";
import batchReceipt from "./components/batchReceipt";
export default {
  name: "ReceiveNotice",
  dicts: [
    "recive_notice_status",
    "receive_type",
    "business_type_receive",
    "business_type_receive",
  ],
  components: {
    detail,
    receipt,
    batchReceipt,
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
      // 激活禁用
      active: true,
      // 失效禁用
      inactive: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 入库通知表格数据
      wmsReceiveNoticeList: [],
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
        status: null,
        startTime: null,
        endTime: null,
        noticeUser: null,
        noticeTime: null,
        supplierId: null,
        orderByColumn: "",
        isAsc: "",
        statusArr: [0, 1],
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
      listWmsReceiveNotice(this.queryParams).then((response) => {
        this.wmsReceiveNoticeList = response.rows;
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

      if (selection.length > 0) {
        if (selection.length > 1) {
          this.active = true;
          this.inactive = true;
        } else {
          this.active = selection[0].status !== 0;
          this.inactive = selection[0].status !== 1;
        }
      }
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getWmsReceiveNotice(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改入库通知";
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "warehouse/wmsReceiveNotice/export",
        {
          ...this.queryParams,
        },
        `wmsReceiveNotice_${new Date().getTime()}.xlsx`
      );
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      this.$refs.detail.getList(row);
    },
    /** 收货按钮操作 */
    handleReceipt(row) {
      this.$refs.receipt.start(row);
    },
    /** 激活按钮操作 */
    handleActive() {
      if (this.ids == null || this.ids.length == 0) {
        this.$modal.msgWarning("请选择要激活的入库通知");
        return;
      }
      this.activeForm = {
        id: this.ids[0],
        startTime: null,
      };
      this.activeVisible = true;
    },

    /** 反激活 */
    handleInactive() {
      if (this.ids == null || this.ids.length == 0) {
        this.$modal.msgWarning("请选择要反激活的入库通知");
        return;
      }
      const ids = this.ids;
      this.$modal
        .confirm("是否确认反激活入库通知？")
        .then(function () {
          return inactiveWmsReceiveNotice(ids);
        })
        .then((response) => {
          this.$modal.msgSuccess("反激活成功");
          this.getList();
        });
    },
    /** 激活提交按钮 */
    activeSubmitForm() {
      this.$refs["activeForm"].validate((valid) => {
        if (valid) {
          activeWmsReceiveNotice(this.activeForm).then((response) => {
            this.$modal.msgSuccess("修改成功");
            this.activeVisible = false;
            this.activeForm = {};
            this.getList();
          });
        }
      });
    },
    /**激活取消按钮 */
    activeCancel() {
      this.activeVisible = false;
    },
    /** 作废 */
    handleInvalid() {
      if (this.ids == null || this.ids.length == 0) {
        this.$modal.msgWarning("请选择要作废的入库通知");
        return;
      }
      var rowData = this.wmsReceiveNoticeList.filter(
        (item) => item.id == this.ids[0]
      )[0];
      this.$modal
        .confirm("是否确认作废入库通知？")
        .then(function () {
          return invalidNotice(rowData);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("作废成功");
        })
        .catch(() => {});
    },
    /** 批量上架按钮 */
    handleBatchReceipt(row) {
      this.$refs.batchReceipt.getList(row);
    },

    /** 收货确认 */
    handleConfirm() {
      if (this.ids == null || this.ids.length == 0) {
        this.$modal.msgWarning("请选择要确认收货入库通知");
        return;
      }
      var idList = this.ids;
      this.$modal
        .confirm("是否确认收货入库通知？")
        .then(() => {
          this.$modal.loading("正在确认中...");
          receiveConfirm(idList)
            .then((response) => {
              this.$modal.closeLoading();
              this.$modal.msgSuccess("确认成功");
              this.getList();
            })
            .catch(() => {
              this.$modal.closeLoading();
            });
        })
        .catch(() => {});
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
