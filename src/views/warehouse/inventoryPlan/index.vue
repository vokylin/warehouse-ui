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
      <el-form-item label="计划编码" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入盘点计划编码"
          @keyup.enter.native="handleQuery"
          clearable
        />
      </el-form-item>

      <el-form-item label="盘点方法" prop="inventoryMethod">
        <el-select
          v-model="queryParams.inventoryMethod"
          placeholder="请选择盘点方法"
          @change="handleQuery"
          clearable
        >
          <el-option
            v-for="item in dict.type.inventory_method"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          @change="handleQuery"
          clearable
        >
          <el-option
            v-for="item in dict.type.inventory_plan_status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
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
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['warehouse:inventoryPlan:add']"
          >新建</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="!canEdit"
          @click="handleUpdate"
          v-hasPermi="['warehouse:inventoryPlan:edit']"
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
          v-hasPermi="['warehouse:inventoryPlan:remove']"
          >删除</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="inventoryPlanList"
      @selection-change="handleSelectionChange"
      :default-sort="defaultSort"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="盘点计划编码"
        align="center"
        prop="id"
        width="160"
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
        label="盘点计划名称"
        align="center"
        prop="planName"
        width="160"
        :show-overflow-tooltip="true"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      />
      <el-table-column label="盘点方法" align="center" prop="inventoryMethod">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.inventory_method"
            :value="scope.row.inventoryMethod"
          />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.inventory_plan_status"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <!-- <el-table-column label="库存状态" align="center" prop="storageStatus">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.storage_status"
            :value="scope.row.storageStatus"
          />
        </template>
      </el-table-column> -->
      <el-table-column
        label="计划时间"
        align="center"
        prop="planTime"
        width="180"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
      </el-table-column>
      <el-table-column
        label="备注"
        align="center"
        prop="remark"
        width="180"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="创建人" align="center" prop="createByName" />
      <el-table-column
        label="开始时间"
        align="center"
        prop="startTime"
        width="180"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
      </el-table-column>
      <el-table-column
        label="结束时间"
        align="center"
        prop="endTime"
        width="180"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="reviewedBy" />
      <el-table-column
        label="操作"
        align="center"
        width="240"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetail(scope.row)"
            v-hasPermi="['warehouse:inventoryPlan:query']"
            >详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-check"
            @click="handleWork(scope.row)"
            v-if="scope.row.status === 0"
            v-hasPermi="['warehouse:inventoryPlan:work']"
            >作业</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit-outline"
            @click="handleCheckIn(scope.row)"
            v-if="scope.row.status === 1"
            v-hasPermi="['warehouse:inventoryPlan:register']"
            >登记</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-finished"
            @click="handleFinish(scope.row)"
            v-if="scope.row.status === 1"
            v-hasPermi="['warehouse:inventoryPlan:finish']"
            >完成</el-button
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

    <!-- 盘点登记对话框 -->
    <blind-register ref="blindRegister"></blind-register>
    <bright-register ref="brightRegister"></bright-register>

    <!-- 详情 -->
    <bright-detail ref="brightDetail"></bright-detail>
    <blind-detail ref="blindDetail"></blind-detail>

    <!-- 添加或修改盘点计划对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="计划名称" prop="planName">
          <el-input v-model="form.planName" placeholder="请输入计划名称" />
        </el-form-item>

        <el-form-item label="仓库" prop="warehouseIdArr">
          <el-select
            v-model="form.warehouseIdArr"
            placeholder="请选择仓库"
            style="width: 100%"
            multiple
            filterable
          >
            <el-option
              v-for="item in warehouseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="盘点方法" prop="inventoryMethod">
          <el-select
            v-model="form.inventoryMethod"
            placeholder="请选择盘点方法"
            style="width: 100%"
          >
            <el-option
              v-for="item in dict.type.inventory_method"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="库存状态" prop="storageStatusArr">
          <el-select
            v-model="form.storageStatusArr"
            placeholder="请选择库存状态"
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="item in dict.type.storage_status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="计划时间" prop="planTime">
          <el-date-picker
            v-model="form.planTime"
            type="datetime"
            placeholder="请选择计划时间"
            style="width: 100%"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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
  listInventoryPlan,
  getInventoryPlan,
  delInventoryPlan,
  addInventoryPlan,
  updateInventoryPlan,
  inventoryPlanJob,
  inventoryPlanFinish,
} from "@/api/warehouse/inventoryPlan";
import brightRegister from "./components/brightRegister";
import blindRegister from "./components/blindRegister";
import brightDetail from "./components/brightDetail";
import blindDetail from "./components/blindDetail";
import { getWarehouseList } from "@/api/system/warehouse";
export default {
  dicts: ["inventory_plan_status", "inventory_method", "storage_status"],
  name: "InventoryPlan",
  components: {
    brightDetail,
    blindDetail,
    brightRegister,
    blindRegister,
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
      // 盘点计划表格数据
      inventoryPlanList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyId: null,
        warehouseIds: null,
        inventoryMethod: null,
        storageStatus: null,
        status: null,
        id: null,
        orderByColumn: "planTime",
        isAsc: "desc",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        planName: [
          { required: true, message: "请输入盘点计划名称", trigger: "blur" },
        ],
        warehouseIdArr: [
          { required: true, message: "请选择仓库", trigger: "blur" },
        ],
        inventoryMethod: [
          { required: true, message: "请选择盘点方法", trigger: "blur" },
        ],
        storageStatusArr: [
          { required: true, message: "请选择库存状态", trigger: "blur" },
        ],
        planTime: [
          { required: true, message: "请选择计划时间", trigger: "blur" },
        ],
      },
      // 仓库列表
      warehouseList: [],
      // 是否可以修改
      canEdit: false,
      // 默认排序
      defaultSort: { prop: "planTime", order: "descending" },
    };
  },
  created() {
    this.getList();
    this.getWarehouseList();
  },
  methods: {
    /** 查询盘点计划列表 */
    getList() {
      this.loading = true;
      listInventoryPlan(this.queryParams).then((response) => {
        this.inventoryPlanList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 获取仓库下拉框数据 */
    getWarehouseList() {
      getWarehouseList().then((response) => {
        this.warehouseList = response.data;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.getList();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        warehouseIds: null,
        inventoryMethod: null,
        storageStatus: null,
        storageStatusArr: [],
        warehouseIdArr: [],
        planTime: null,
        planName: null,
        remark: null,
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
        let userId = this.$store.state.user.userId;
        let hasRole =
          this.$auth.hasRoleOr(["admin", "wms-manager"]) ||
          userId == item.createBy;
        this.canEdit = item.status === 0 && hasRole && selection.length === 1;
        return item.id;
      });
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
      if (selection == null || selection.length == 0) {
        this.canEdit = false;
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加盘点计划";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getInventoryPlan(id).then((response) => {
        this.form.id = response.data.id;
        this.form.planName = response.data.planName;
        this.form.planTime = response.data.planTime;
        this.form.remark = response.data.remark;
        this.form.warehouseIdArr = response.data.warehouseIds.split(",");
        this.form.storageStatusArr = response.data.storageStatus.split(",");
        this.form.inventoryMethod = response.data.inventoryMethod.toString();
        this.open = true;
        this.title = "修改盘点计划";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.warehouseIds = this.form.warehouseIdArr.join(",");
          this.form.storageStatus = this.form.storageStatusArr.join(",");
          if (this.form.id != null) {
            updateInventoryPlan(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInventoryPlan(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除盘点计划编号为"' + ids + '"的数据项？')
        .then(function () {
          return delInventoryPlan(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 盘点作业按钮操作 */
    handleWork(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm("是否进行盘点作业？").then((response) => {
        this.$modal.loading("正在盘点作业中，请稍后...");
        inventoryPlanJob(ids)
          .then(() => {
            this.$modal.closeLoading();
            this.getList();
            this.$modal.msgSuccess("盘点作业成功");
          })
          .catch(() => {
            this.$modal.closeLoading();
          });
      });
    },

    /** 盘点登记按钮 */
    handleCheckIn(row) {
      if (row.inventoryMethod === 0) {
        this.$refs.brightRegister.start(row);
        return;
      } else {
        this.$refs.blindRegister.start(row);
        return;
      }
    },

    /** 查看明细按钮操作 */
    handleDetail(row) {
      // 明盘
      if (row.inventoryMethod === 0) {
        this.$refs.brightDetail.start(row);
        return;
      } else {
        // 暗盘
        this.$refs.blindDetail.start(row);
        return;
      }
    },
    /** 盘点完成 */
    handleFinish(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm("是否确认盘点完成？")
        .then(function () {
          return inventoryPlanFinish(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("盘点完成成功");
        })
        .catch(() => {});
    },
  },
};
</script>
