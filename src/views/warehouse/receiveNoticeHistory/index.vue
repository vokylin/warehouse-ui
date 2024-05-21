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
          filterable
          clearable
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
          type="success"
          plain
          icon="el-icon-document"
          size="mini"
          :disabled="multiple || !isInStorage"
          @click="handlePrintInstorageDoc(true)"
          v-hasPermi="['warehouse:receiveNotice:inStorageDoc']"
          >入库单</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-document"
          size="mini"
          :disabled="multiple || !isInStorage"
          @click="handlePrintInstorageDoc(false)"
          v-hasPermi="['warehouse:receiveNotice:inStorageDoc']"
          >入库单(无金额)</el-button
        >
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-document"
          size="mini"
          :disabled="multiple || !isReturnMaterial"
          @click="handlePrintReturnMaterial(true)"
          v-hasPermi="['warehouse:receiveNotice:returnMaterial']"
          >退料单</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-document"
          size="mini"
          :disabled="multiple || !isReturnMaterial"
          @click="handlePrintReturnMaterial(false)"
          v-hasPermi="['warehouse:receiveNotice:returnMaterial']"
          >退料单(无金额)</el-button
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
        label="单据说明"
        align="center"
        prop="noticeDesc"
        width="120"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.noticeDesc ? scope.row.noticeDesc : "-" }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="公司ID" align="center" prop="companyId" /> -->
      <!-- <el-table-column label="供应商ID" align="center" prop="supplierId" /> -->
      <el-table-column
        label="发出方编码"
        width="180"
        align="center"
        prop="fromCode"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.fromCode ? scope.row.fromCode : "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="发出方名称"
        width="180"
        align="center"
        prop="fromName"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.fromName ? scope.row.fromName : "-" }}</span>
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
        label="收货开始时间"
        align="center"
        prop="startTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.startTime, "{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="收货完成时间"
        align="center"
        prop="endTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.endTime, "{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="通知人" align="center" prop="noticeUser" />
      <el-table-column
        label="通知时间"
        align="center"
        prop="noticeTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.noticeTime, "{y}-{m}-{d} {h}:{i}:{s}")
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
            v-hasPermi="['warehouse:receiveNotice:list']"
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
    <inStoragePrint ref="inStoragePrint" />
    <returnMaterialPrint ref="returnMaterialPrint" />
  </div>
</template>

<script>
import { listWmsReceiveNotice } from "@/api/warehouse/receiveNotice";
import detail from "../receiveNotice/components/detail";
import inStoragePrint from "@/views/components/printDoc/inStoragePrint.vue";
import returnMaterialPrint from "@/views/components/printDoc/returnMaterialPrint.vue";
export default {
  dicts: [
    "recive_notice_status",
    "receive_send_type",
    "receive_type",
    "business_type_receive",
  ],
  name: "ReceiveNotice",
  components: {
    detail,
    inStoragePrint,
    returnMaterialPrint,
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
        statusArr: [8, 9],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      // 入库单
      isInStorage: false,
      // 退料单
      isReturnMaterial: false,
    };
  },
  created() {
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
      this.ids = selection.map((item) => {
        this.isInStorage = item.billType === 0;
        this.isReturnMaterial = item.billType === 1;
        return item.id;
      });
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    /** 详情按钮操作 */
    handleDetail(row) {
      this.$refs.detail.getList(row);
    },

    handlePrintInstorageDoc(isShowPrice) {
      this.$refs.inStoragePrint.open(this.ids[0], isShowPrice);
    },
    handlePrintReturnMaterial(isShowPrice) {
      this.$refs.returnMaterialPrint.open(this.ids[0], isShowPrice);
    },
  },
};
</script>
