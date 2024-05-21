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
      <el-form-item label="报损单号" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入报损单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单据类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择单据类型"
          filterable
          clearable
          @change="handleQuery"
        >
          <el-option
            v-for="dict in dict.type.breakage_doc_item_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          filterable
          clearable
          @change="handleQuery"
        >
          <el-option
            v-for="dict in dict.type.breakage_doc_status"
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
          icon="el-icon-document-add"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['warehouse:breakageDoc:add']"
          >新建</el-button
        >
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="!canEdit"
          @click="handleUpdate"
          v-hasPermi="['warehouse:breakageDoc:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="!canEdit"
          @click="handleDelete"
          v-hasPermi="['warehouse:breakageDoc:remove']"
          >删除</el-button
        >
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-document"
          size="mini"
          @click="handleDetail"
          :disabled="single"
          v-hasPermi="['warehouse:breakageDoc:query']"
          >查看明细</el-button
        >
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-setting"
          size="mini"
          :disabled="!canEdit"
          @click="handleAddDetail"
          v-hasPermi="['warehouse:breakageDoc:addDetail']"
          >设置明细</el-button
        >
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-check"
          size="mini"
          @click="handleCommit"
          :disabled="!canEdit"
          v-hasPermi="['warehouse:breakageDoc:submit']"
          >提交</el-button
        >
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-check"
          size="mini"
          @click="handlePrint"
          v-hasPermi="['warehouse:breakageDoc:print']"
          :disabled="single || canPrint"
          >打印</el-button
        >
      </el-col>

      <!--<el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-check"
          size="mini"
          @click="handleApproved"
          >审批通过</el-button
        >
      </el-col>-->

      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="breakageDocList"
      @selection-change="handleSelectionChange"
      :default-sort="defaultSort"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="报损单号" align="center" width="160" prop="id">
        <template slot-scope="scope">
          <el-link
            :underline="false"
            type="primary"
            @click="handleDetail(scope.row)"
            >{{ scope.row.id }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="120" prop="status">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.breakage_doc_status"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column label="申请部门" align="center" prop="officeName" />
      <el-table-column label="申请人" align="center" prop="applicant" />
      <el-table-column
        label="收发类型"
        align="center"
        width="260"
        prop="receiveSendType"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.breakage_doc_type"
            :value="scope.row.receiveSendType"
          />
        </template>
      </el-table-column>
      <el-table-column label="报损类型" align="center" width="180" prop="type">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.breakage_doc_item_type"
            :value="scope.row.type"
          />
        </template>
      </el-table-column>
      <el-table-column label="报损原因" align="center" prop="reason">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.scrap_reason"
            :value="scope.row.reason"
          />
        </template>
      </el-table-column>
      <el-table-column label="报损说明" align="center" prop="description" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="160"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      />
      <el-table-column
        label="报损时间"
        align="center"
        prop="occTime"
        width="160"
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

    <!-- 详情入库通知对话框 -->
    <detail ref="detail" />
    <!-- 设置明细对话框 -->
    <settingDetail ref="settingDetail" />
    <!-- 单据打印 -->
    <breakageDocPrint ref="breakageDocPrint" />

    <!-- 新增报损单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="35%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item v-if="form.id" label="申请部门" prop="officeId">
          <treeselect
            disabled
            v-model="form.officeId"
            :options="deptOptions"
            :show-count="true"
            placeholder="请选择申请部门"
            style="width: 80%"
            @select="selectDepart"
          />
        </el-form-item>
        <el-form-item v-if="form.id" label="申请人" prop="applicant">
          <el-input
            disabled
            v-model="form.applicant"
            placeholder="请输入申请人"
            clearable
            style="width: 80%"
          />
        </el-form-item>
        <el-form-item label="报损时间" prop="occTime">
          <el-date-picker
            v-model="form.occTime"
            type="datetime"
            placeholder="请选择报损时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 80%"
          />
        </el-form-item>

        <el-form-item label="报损类型" prop="type">
          <el-select
            v-model="form.type"
            placeholder="请选择报损类型"
            filterable
            clearable
            style="width: 80%"
          >
            <el-option
              v-for="dict in dict.type.breakage_doc_item_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="收发类型" prop="receiveSendType">
          <el-select
            v-model="form.receiveSendType"
            placeholder="请选择报损类型"
            filterable
            clearable
            style="width: 80%"
          >
            <el-option
              v-for="dict in dict.type.breakage_doc_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="报废原因" prop="reason">
          <el-select
            v-model="form.reason"
            placeholder="请选择报废原因"
            filterable
            clearable
            style="width: 80%"
          >
            <el-option
              v-for="dict in dict.type.scrap_reason"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="报损说明" prop="description">
          <el-input
            v-model="form.description"
            placeholder="请输入报损说明"
            clearable
            style="width: 80%"
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listBreakageDoc,
  getBreakageDoc,
  delBreakageDoc,
  addBreakageDoc,
  updateBreakageDoc,
  commitBreakageDoc,
  auditPass,
} from "@/api/warehouse/breakageDoc";
import settingDetail from "./components/settingDetail";
import detail from "./components/detail";
import { deptTreeSelect } from "@/api/system/user";
import breakageDocPrint from "@/views/components/printDoc/breakageDocPrint";
import Treeselect from "@riophae/vue-treeselect";
import { checkPermi, checkRole } from "@/utils/permission";
export default {
  dicts: [
    "breakage_doc_item_type",
    "breakage_doc_type",
    "breakage_doc_status",
    "scrap_reason",
  ],
  name: "breakageDoc",
  components: {
    detail,
    settingDetail,
    Treeselect,
    breakageDocPrint,
  },
  data() {
    checkPermi, checkRole;
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
      breakageDocList: [],
      // 行数据
      rowData: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        companyId: null,
        officeId: null,
        officeName: null,
        applicant: null,
        type: null,
        status: null,
        reason: null,
        orderByColumn: "createTime",
        isAsc: "desc",
      },
      // 部门下拉树结构
      deptOptions: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        occTime: [
          { required: true, message: "请选择报损时间", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择报损类型", trigger: "blur" }],
        receiveSendType: [
          { required: true, message: "请选择收发类型", trigger: "blur" },
        ],
        reason: [
          { required: true, message: "请选择报废原因", trigger: "blur" },
        ],
      },
      // 默认排序
      defaultSort: { prop: "createTime", order: "descending" },
      // 是否可以修改
      canEdit: false,
      // 是否可以打印
      canPrint: false,
    };
  },
  created() {
    this.getList();
    this.getDeptTree();
  },
  methods: {
    /** 查询报损单列表 */
    getList() {
      this.loading = true;
      listBreakageDoc(this.queryParams).then((response) => {
        this.breakageDocList = response.rows;
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
        companyId: null,
        officeId: null,
        officeName: null,
        applicant: null,
        type: null,
        receiveSendType: null,
        status: null,
        reason: null,
        occTime: null,
        description: null,
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
      this.rowData = selection;
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
      this.ids = selection.map((item) => {
        let userId = this.$store.state.user.userId;
        let hasRole = this.$auth.hasRoleOr(["admin", "wms-manager"]) || userId == item.applicantId;
        this.canEdit = item.status === 0 && hasRole && selection.length === 1;
        this.canPrint = item.status !== 2
        return item.id;
      });
      this.rowData = selection;
      if (selection == null || selection.length == 0) {
        this.canEdit = false;
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加报损单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getBreakageDoc(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改报损单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateBreakageDoc(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBreakageDoc(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete() {
      const ids = this.ids;
      this.$modal
        .confirm('是否确认删除报损单编号为"' + ids + '"的数据项？')
        .then(function () {
          return delBreakageDoc(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },

    /** 查看明细按钮操作 */
    handleDetail(row) {
      const data = this.rowData[0] || row;
      this.$refs.detail.start(data);
    },

    /** 设置明细按钮操作 */
    handleAddDetail() {
      let rowData = this.breakageDocList.find(
        (item) => item.id === this.ids[0]
      );
      this.$refs.settingDetail.start(rowData);
    },

    /** 查询部门下拉树结构 */
    getDeptTree() {
      deptTreeSelect().then((response) => {
        this.deptOptions = response.data;
      });
    },

    /** 提交按钮操作 */
    handleCommit() {
      const ids = this.ids;
      this.$modal
        .confirm("是否确认提交报损单?")
        .then(function () {
          return commitBreakageDoc(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("提交成功");
        })
        .catch(() => {});
    },
    // 获取当前选中部门的名称
    selectDepart(val) {
      this.form.officeName = val.label;
    },

    /** 打印按钮 */
    handlePrint() {
      const ids = this.ids;
      this.$refs.breakageDocPrint.open(ids);
    },

    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.getList();
    },

    handleApproved() {
      const id = this.ids;
      auditPass(id).then((response) => {
        this.$modal.msgSuccess("审批成功");
        this.getList();
      });
    },
  },
};
</script>
