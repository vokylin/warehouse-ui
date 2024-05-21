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
      <el-form-item label="物料编码" prop="productCode">
        <el-input
          v-model="queryParams.productCode"
          placeholder="请输入物料编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入物料名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          icon="el-icon-search"
          size="mini"
          @click="handleUnitConversion"
          :disabled="multiple"
          v-hasPermi="['system:productInfo:query']"
          >查看单位换算</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-edit"
          size="mini"
          @click="handleEdit"
          :disabled="single"
          v-hasPermi="['system:productInfo:edit']"
          >修改仓库属性</el-button
        >
      </el-col>

      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="productInfoList"
      @selection-change="handleSelectionChange"
      :default-sort="defaultSort"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="物料编码"
        width="180"
        align="center"
        prop="productCode"
      />
      <el-table-column
        label="物料名称"
        width="260"
        align="center"
        prop="productName"
      />
      <el-table-column label="单位" align="center" prop="masterUnit" />
      <el-table-column label="规格" width="120" align="center" prop="spec" />
      <el-table-column
        label="保质期（天）"
        width="100"
        align="center"
        prop="effectiveEndDate"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      />
      <el-table-column label="物料类型" align="center" prop="materialType">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.material_type"
            :value="scope.row.materialType"
          />
        </template>
      </el-table-column>
      <el-table-column label="上限数量" align="center" prop="upQuality" />
      <el-table-column label="下限数量" align="center" prop="downQuality" />
      <el-table-column label="提前预警天数" align="center" prop="remindDay" />
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改物料主档对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="上限数量" prop="upQuality">
          <el-input v-model="form.upQuality" placeholder="上限数量" />
        </el-form-item>
        <el-form-item label="下限数量" prop="downQuality">
          <el-input v-model="form.downQuality" placeholder="下限数量" />
        </el-form-item>
        <el-form-item label="提前预警天数" prop="remindDay">
          <el-input v-model="form.remindDay" placeholder="提前预警天数" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 单位换算弹框 -->
    <dose-unit ref="doseUnit" />
  </div>
</template>

<script>
import { listProductInfo } from "@/api/system/productInfo";
import doseUnit from "./components/doseUnit";
import {
  addAttribute,
  updateAttribute,
  getAttribute,
} from "@/api/system/attribute";

export default {
  dicts: ["material_type"],
  name: "ProductInfo",
  components: {
    doseUnit,
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
      // 物料主档表格数据
      productInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        productCode: null,
        productName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        upQuality: [
          { required: true, message: "请输入上限数量", trigger: "blur" },
          {
            pattern: /^[0-9]\d*$/,
            message: "请输入有效的数量",
            trigger: "blur",
          },
        ],
        downQuality: [
          { required: true, message: "请输入下限数量", trigger: "blur" },
          {
            pattern: /^[0-9]\d*$/,
            message: "请输入有效的数量",
            trigger: "blur",
          },
        ],
        remindDay: [
          { required: true, message: "请输入提前预警天数", trigger: "blur" },
          {
            pattern: /^[0-9]\d*$/,
            message: "请输入有效的天数",
            trigger: "blur",
          },
        ],
      },
      // 默认排序
      defaultSort: { prop: "productCode", order: "descending" },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询物料主档列表 */
    getList() {
      this.loading = true;
      listProductInfo(this.queryParams).then((response) => {
        this.productInfoList = response.rows;
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
        itemCode: null,
        upQuality: null,
        downQuality: null,
        remindDay: null,
        limitedStatus: null,
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
      this.$refs.tables.sort(this.defaultSort.prop, this.defaultSort.order);
    },
    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    // 查看单位换算按钮
    handleUnitConversion() {
      const id = this.ids;
      this.$refs.doseUnit.getList(
        this.productInfoList.filter((item) => item.id == id)[0]
      );
    },

    /** 修改物料仓库树形按钮操作 */
    handleEdit() {
      this.reset();
      const id = this.ids;
      var rowData;
      this.productInfoList.forEach((item) => {
        if (item.id == id) {
          rowData = item;
        }
      });
      getAttribute(rowData.productCode).then((response) => {
        this.form.id = response.data == null ? null : response.data.id;
        this.form.upQuality =
          response.data == null ? null : response.data.upQuality;
        this.form.downQuality =
          response.data == null ? null : response.data.downQuality;
        this.form.remindDay =
          response.data == null ? null : response.data.remindDay;
        this.form.limitedStatus =
          response.data == null ? null : response.data.limitedStatus;
        this.form.companyId = rowData.companyId;
        this.form.itemCode = rowData.productCode;
        this.open = true;
        this.title = "修改物料仓库属性";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // 校验上限数量不能小于下限数量
          if (Number(this.form.upQuality) < Number(this.form.downQuality)) {
            console.log(this.form)
            this.$modal.msgError("上限数量不能小于下限数量");
            return;
          }

          if (this.form.id != null) {
            updateAttribute(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAttribute(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
  },
};
</script>
