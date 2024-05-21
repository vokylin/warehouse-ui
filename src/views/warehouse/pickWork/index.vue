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
      <!--<el-form-item label="温层" prop="thermosphere">
        <el-select
          v-model="queryParams.thermosphere"
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
      </el-form-item>-->
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
          icon="el-icon-finished"
          size="mini"
          @click="handleWorkFinish"
          :disabled="single || !isWorkFinish"
          v-hasPermi="['warehouse:pickWork:workFinish']"
          >作业完成</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-close"
          size="mini"
          :disabled="single || !isWorkFinish"
          @click="handleWorkCancel"
          v-hasPermi="['warehouse:pickWork:workCancel']"
          >作业取消</el-button
        >
      </el-col>

      <el-col :span="1.5"
        ><el-button
          size="mini"
          plain
          type="danger"
          icon="el-icon-edit"
          :disabled="single || !isShortageRegister"
          @click="handleShortageCheckIn()"
          v-hasPermi="['warehouse:pickWork:register']"
          >缺货登记</el-button
        >
      </el-col>

      <el-col :span="1.5">
        <el-button
          size="mini"
          type="success"
          plain
          icon="el-icon-check"
          :disabled="single || !isWorkRegister"
          @click="handleRegisterFinish()"
          v-hasPermi="['warehouse:pickWork:registerComplete']"
          >登记完成</el-button
        ></el-col
      >
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="workNoticeList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="拣货通知编号"
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
        label="出库通知编号"
        width="180"
        align="center"
        prop="noticeId"
      />
      <el-table-column label="收发类型" align="center" prop="receiveSendType">
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

    <!-- 手动作业对话框 -->
    <shortage-check-in ref="shortageCheckIn" @refreshTable="refreshTable" />
  </div>
</template>

<script>
import {
  listWorkNotice,
  completeWork,
  cancelWork,
  registerComplete,
} from "@/api/warehouse/workNotice";
import detail from "./components/detail";
import shortageCheckIn from "./components/shortageCheckIn";
export default {
  dicts: [
    "thermosphere",
    "pick_work_notice_status",
    "delivery_type",
    "work_type",
  ],
  name: "ReceiveNotice",
  components: {
    detail,
    shortageCheckIn,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      selectData: {},
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
        statusArr: [0, 1],
        companyId: null,
        status: null,
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
      isWorkFinish: false,
      isWorkRegister: false,
      // 是否可以缺货登记
      isShortageRegister: false,
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

    // 刷新列表
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
        this.isWorkFinish = item.status === 0;
        this.isWorkRegister = item.status === 1;
        if(item.status === 1 || item.status === 0){
          this.isShortageRegister = true;
        }else{
          this.isShortageRegister = false;
        }
        return item.id;
      });
      this.selectData = selection;
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    /** 详情按钮操作 */
    handleDetail(row) {
      this.$refs.detail.getList(row);
    },
    // 刷新
    refresh() {
      this.getList();
    },

    // 取消
    handleCancel(row) {
      row.deliveryNoticeDetailId = this.deliveryNoticeDetailData.id;
      this.$confirm("确认退货吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          cancelAllotItemStorageDetail(row).then((response) => {
            this.$message({
              type: "success",
              message: "退货成功!",
            });
          });
          this.reset();
        })
        .catch(() => {});
    },

    /** 作业完成 */
    handleWorkFinish() {
      this.$confirm("是否作业完成？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$modal.loading("正在完成作业...");
          completeWork(this.selectData[0])
            .then((response) => {
              this.$modal.closeLoading();
              this.$modal.msgSuccess("作业完成成功");
              this.getList();
            })
            .catch(() => {
              this.$modal.closeLoading();
            });
        })
        .catch(() => {});
    },

    /** 作业取消 */
    handleWorkCancel() {
      this.$confirm("是否作业取消？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          cancelWork(this.selectData[0]).then((response) => {
            this.$modal.msgSuccess("作业取消成功");
            this.getList();
          });
        })
        .catch(() => {});
    },
    /** 缺货登记 */
    handleShortageCheckIn() {
      this.workNoticeList.forEach((item) => {
        if (item.id === this.ids[0]) {
          this.$refs.shortageCheckIn.start(item);
          return;
        }
      });
    },

    /** 登记完成 */
    handleRegisterFinish() {
      this.$confirm("是否登记完成？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$modal.loading("登记确认中...");
          registerComplete(this.selectData[0])
            .then((response) => {
              this.$modal.closeLoading();
              this.$modal.msgSuccess("登记完成");
              this.getList();
            })
            .catch(() => {
              this.$modal.closeLoading();
            });
        })

    },
  },
};
</script>
