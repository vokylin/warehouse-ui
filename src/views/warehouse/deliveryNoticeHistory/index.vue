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
          icon="el-icon-document"
          size="mini"
          :disabled="single || isPrint"
          v-hasPermi="['warehouse:deliveryNoticeHistory:pickListPrint']"
          @click="handlePickingListPrintDoc(true)"
          >领料单</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-document"
          size="mini"
          :disabled="single || isPrint"
          v-hasPermi="['warehouse:deliveryNoticeHistory:pickListPrint']"
          @click="handlePickingListPrintDoc(false)"
          >领料单(无金额)</el-button
        >
      </el-col>
      <el-col :span="1.5"
        ><el-button
          size="mini"
          type="primary"
          plain
          icon="el-icon-circle-check"
          :disabled="single || isShowDeliveryConfirm"
          @click="handleDeliveryConfirm"
          >出库确认记录</el-button
        ></el-col
      >

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
      >
        <template slot-scope="scope">
          <span>{{ scope.row.businessId ? scope.row.businessId : "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="单据类型"
        width="120"
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
            scope.row.deliveryStartTime
              ? parseTime(
                  scope.row.deliveryStartTime,
                  "{y}-{m}-{d} {h}:{i}:{s}"
                )
              : "-"
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
            scope.row.deliveryEndTime
              ? parseTime(scope.row.deliveryEndTime, "{y}-{m}-{d} {h}:{i}:{s}")
              : "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="通知人名称"
        align="center"
        width="120"
        prop="noticeUser"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.noticeUser ? scope.row.noticeUser : "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="收货方编码"
        align="center"
        width="120"
        prop="toCode"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.toCode ? scope.row.toCode : "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="收货方名称"
        align="center"
        width="240"
        prop="toName"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.toName ? scope.row.toName : "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="收货方联系人"
        align="center"
        width="120"
        prop="toContacts"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.toContacts ? scope.row.toContacts : "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="联系电话"
        align="center"
        width="120"
        prop="toContactsTel"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.toContactsTel ? scope.row.toContactsTel : "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="联系地址"
        align="center"
        prop="toAddress"
        width="240"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.toAddress ? scope.row.toAddress : "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="80">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetail(scope.row)"
            v-hasPermi="['warehouse:deliveryNoticeHistory:detail']"
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

    <!-- 详情入库通知对话框 -->
    <detail ref="detail" />

    <!-- 打印预览弹框 -->
    <pickingListPrint ref="pickingListPrint" />

    <delivery-confirm ref="deliveryConfirm" @refreshTable="getList" />
  </div>
</template>

<script>
import { listDeliveryNotice } from "@/api/warehouse/deliveryNotice";
import detail from "../deliveryNotice/components/detail";
import pickingListPrint from "@/views/components/printDoc/pickingListPrint";
import deliveryConfirm from "./components/deliveryConfirm";
export default {
  dicts: [
    "delivery_notice_status",
    "thermosphere",
    "delivery_type",
    "business_type_delivery",
  ],
  name: "deliveryNotice",
  components: {
    detail,
    pickingListPrint,
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
        statusArr: [3, 6, 7],
        startTime: null,
        endTime: null,
        noticeUser: null,
        noticeTime: null,
        supplierId: null,
        orderByColumn: "createTime",
        isAsc: "descending",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      // 激活弹出层
      activeVisible: false,
      activeForm: {},
      activeForm: {},
      activeRules: {
        thermosphere: [
          { required: true, message: "请选择温层", trigger: "change" },
        ],
        deliveryStartTime: [
          { required: true, message: "请选择出库时间", trigger: "change" },
        ],
      },
      // 默认排序
      defaultSort: { prop: "createTime", order: "descending" },
      // 是否可以查看出库确认记录
      isShowDeliveryConfirm: false,
      // 是否可以打印单据
      isPrint: true,
    };
  },
  created() {
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
      this.ids = selection.map((item) => {
        if (
          item.businessType == "020004" ||
          item.businessType == "020005" ||
          item.status === 7 ||
          item.status === 3
        ) {
          this.isShowDeliveryConfirm = true;
        } else {
          this.isShowDeliveryConfirm = false;
        }
        this.isPrint = item.status === 7 || item.status === 3;
        return item.id;
      });
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
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
    // 领料单打印
    handlePickingListPrintDoc(isShowPrice) {
      if (this.ids == null || this.ids.length == 0) {
        this.$modal.msgWarning("请选择要打印的入库通知");
        return;
      }
      // 打开打印弹出层
      this.$refs.pickingListPrint.open(this.ids[0], isShowPrice);
    },
    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.getList();
    },

    /** 出库确认记录 */
    handleDeliveryConfirm() {
      let rowData = {};
      this.deliveryNoticeList.forEach((item) => {
        if (item.id === this.ids[0]) {
          rowData = item;
        }
      });
      this.$refs.deliveryConfirm.getList(rowData);
    },
  },
};
</script>
