<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="商品编码" prop="productCode">
        <el-input
          v-model="queryParams.productCode"
          placeholder="请输入商品编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入商品名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主计量单位" prop="masterUnit">
        <el-input
          v-model="queryParams.masterUnit"
          placeholder="请输入主计量单位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="换算率" prop="conversionRate">
        <el-input
          v-model="queryParams.conversionRate"
          placeholder="请输入换算率"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属：sales-销售 purchase-采购 manufacture-生产 warehouse-库存剂量单位" prop="belongs">
        <el-input
          v-model="queryParams.belongs"
          placeholder="请输入所属：sales-销售 purchase-采购 manufacture-生产 warehouse-库存剂量单位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="采购/库存/生产/销售/剂量单位 =主剂量单位*换算率" prop="doseUnit">
        <el-input
          v-model="queryParams.doseUnit"
          placeholder="请输入采购/库存/生产/销售/剂量单位 =主剂量单位*换算率"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建人id" prop="createUserId">
        <el-input
          v-model="queryParams.createUserId"
          placeholder="请输入创建人id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建人姓名" prop="createUserName">
        <el-input
          v-model="queryParams.createUserName"
          placeholder="请输入创建人姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="修改人id" prop="updateUserId">
        <el-input
          v-model="queryParams.updateUserId"
          placeholder="请输入修改人id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="修改人姓名" prop="updateUserName">
        <el-input
          v-model="queryParams.updateUserName"
          placeholder="请输入修改人姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="企业唯一key ：E00001" prop="enterpriseKey">
        <el-input
          v-model="queryParams.enterpriseKey"
          placeholder="请输入企业唯一key ：E00001"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
          v-hasPermi="['system:doseUnit:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:doseUnit:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:doseUnit:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:doseUnit:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="doseUnitList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="id" />
      <el-table-column label="商品编码" align="center" prop="productCode" />
      <el-table-column label="商品名称" align="center" prop="productName" />
      <el-table-column label="主计量单位" align="center" prop="masterUnit" />
      <el-table-column label="换算率" align="center" prop="conversionRate" />
      <el-table-column label="所属：sales-销售 purchase-采购 manufacture-生产 warehouse-库存剂量单位" align="center" prop="belongs" />
      <el-table-column label="采购/库存/生产/销售/剂量单位 =主剂量单位*换算率" align="center" prop="doseUnit" />
      <el-table-column label="创建人id" align="center" prop="createUserId" />
      <el-table-column label="创建人姓名" align="center" prop="createUserName" />
      <el-table-column label="修改人id" align="center" prop="updateUserId" />
      <el-table-column label="修改人姓名" align="center" prop="updateUserName" />
      <el-table-column label="企业唯一key ：E00001" align="center" prop="enterpriseKey" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:doseUnit:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:doseUnit:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改剂量单位对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商品编码" prop="productCode">
          <el-input v-model="form.productCode" placeholder="请输入商品编码" />
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="主计量单位" prop="masterUnit">
          <el-input v-model="form.masterUnit" placeholder="请输入主计量单位" />
        </el-form-item>
        <el-form-item label="换算率" prop="conversionRate">
          <el-input v-model="form.conversionRate" placeholder="请输入换算率" />
        </el-form-item>
        <el-form-item label="所属：sales-销售 purchase-采购 manufacture-生产 warehouse-库存剂量单位" prop="belongs">
          <el-input v-model="form.belongs" placeholder="请输入所属：sales-销售 purchase-采购 manufacture-生产 warehouse-库存剂量单位" />
        </el-form-item>
        <el-form-item label="采购/库存/生产/销售/剂量单位 =主剂量单位*换算率" prop="doseUnit">
          <el-input v-model="form.doseUnit" placeholder="请输入采购/库存/生产/销售/剂量单位 =主剂量单位*换算率" />
        </el-form-item>
        <el-form-item label="创建人id" prop="createUserId">
          <el-input v-model="form.createUserId" placeholder="请输入创建人id" />
        </el-form-item>
        <el-form-item label="创建人姓名" prop="createUserName">
          <el-input v-model="form.createUserName" placeholder="请输入创建人姓名" />
        </el-form-item>
        <el-form-item label="修改人id" prop="updateUserId">
          <el-input v-model="form.updateUserId" placeholder="请输入修改人id" />
        </el-form-item>
        <el-form-item label="修改人姓名" prop="updateUserName">
          <el-input v-model="form.updateUserName" placeholder="请输入修改人姓名" />
        </el-form-item>
        <el-form-item label="企业唯一key ：E00001" prop="enterpriseKey">
          <el-input v-model="form.enterpriseKey" placeholder="请输入企业唯一key ：E00001" />
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
import { listDoseUnit, getDoseUnit, delDoseUnit, addDoseUnit, updateDoseUnit } from "@/api/system/doseUnit";

export default {
  name: "DoseUnit",
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
      // 剂量单位表格数据
      doseUnitList: [],
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
        masterUnit: null,
        conversionRate: null,
        belongs: null,
        doseUnit: null,
        createUserId: null,
        createUserName: null,
        updateUserId: null,
        updateUserName: null,
        enterpriseKey: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        productCode: [
          { required: true, message: "商品编码不能为空", trigger: "blur" }
        ],
        productName: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        masterUnit: [
          { required: true, message: "主计量单位不能为空", trigger: "blur" }
        ],
        conversionRate: [
          { required: true, message: "换算率不能为空", trigger: "blur" }
        ],
        belongs: [
          { required: true, message: "所属：sales-销售 purchase-采购 manufacture-生产 warehouse-库存剂量单位不能为空", trigger: "blur" }
        ],
        doseUnit: [
          { required: true, message: "采购/库存/生产/销售/剂量单位 =主剂量单位*换算率不能为空", trigger: "blur" }
        ],
        createUserId: [
          { required: true, message: "创建人id不能为空", trigger: "blur" }
        ],
        createUserName: [
          { required: true, message: "创建人姓名不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询剂量单位列表 */
    getList() {
      this.loading = true;
      listDoseUnit(this.queryParams).then(response => {
        this.doseUnitList = response.rows;
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
        productCode: null,
        productName: null,
        masterUnit: null,
        conversionRate: null,
        belongs: null,
        doseUnit: null,
        createTime: null,
        createUserId: null,
        createUserName: null,
        updateTime: null,
        updateUserId: null,
        updateUserName: null,
        enterpriseKey: null
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加剂量单位";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDoseUnit(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改剂量单位";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateDoseUnit(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDoseUnit(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除剂量单位编号为"' + ids + '"的数据项？').then(function() {
        return delDoseUnit(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/doseUnit/export', {
        ...this.queryParams
      }, `doseUnit_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
