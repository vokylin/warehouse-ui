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
      <el-form-item label="检查项" prop="checkItem">
        <el-input
          v-model="queryParams.checkItem"
          placeholder="请输入检查项"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="温层" prop="thermosphere">
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
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:deliverySureDict:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:deliverySureDict:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:deliverySureDict:remove']"
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
      :data="deliverySureDictList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="温层" align="center" prop="thermosphere" width="160">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.thermosphere"
            :value="scope.row.thermosphere"
          />
        </template>
      </el-table-column>
      <el-table-column label="检查项" align="center" prop="checkItem" />
      <el-table-column label="要求" align="center" prop="checkRequirement" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:deliverySureDict:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:deliverySureDict:remove']"
            >删除</el-button
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

    <!-- 添加或修改出库确认项对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="温层" prop="thermosphere">
          <el-select v-model="form.thermosphere" placeholder="请选择温层">
            <el-option
              v-for="dict in dict.type.thermosphere"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检查项" prop="checkItem">
          <el-input v-model="form.checkItem" placeholder="请输入检查项" />
        </el-form-item>
        <el-form-item label="要求" prop="checkRequirement">
          <el-input v-model="form.checkRequirement" placeholder="请输入要求" />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
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
  listDeliverySureDict,
  getDeliverySureDict,
  delDeliverySureDict,
  addDeliverySureDict,
  updateDeliverySureDict,
} from "@/api/system/deliverySureDict";
import { getWarehouseList } from "@/api/system/warehouse";
export default {
  name: "DeliverySureDict",
  dicts: ["thermosphere"],
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
      // 出库确认项表格数据
      deliverySureDictList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyId: null,
        warehouseId: null,
        checkItem: null,
        sort: null,
        thermosphere: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        thermosphere: [
          { required: true, message: "请选择温层", trigger: "blur" },
        ],
        checkItem: [
          { required: true, message: "请输入检查项", trigger: "blur" },
        ]
      },
      // 仓库下拉框数据
      warehouseList: [],
    };
  },
  created() {
    this.getList();
    this.getWarehouseList();
  },
  methods: {
    /** 查询出库确认项列表 */
    getList() {
      this.loading = true;
      listDeliverySureDict(this.queryParams).then((response) => {
        this.deliverySureDictList = response.rows;
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
    // 表单重置
    reset() {
      this.form = {
        id: null,
        checkItem: null,
        checkRequirement: null,
        sort: null,
        thermosphere: null,
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
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加出库确认项";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getDeliverySureDict(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改出库确认项";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateDeliverySureDict(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDeliverySureDict(this.form).then((response) => {
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
        .confirm('是否确认删除出库确认项编号为"' + ids + '"的数据项？')
        .then(function () {
          return delDeliverySureDict(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/deliverySureDict/export",
        {
          ...this.queryParams,
        },
        `deliverySureDict_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
