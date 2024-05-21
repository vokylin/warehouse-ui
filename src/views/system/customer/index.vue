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
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="简称" prop="shortName">
        <el-input
          v-model="queryParams.shortName"
          placeholder="请输入简称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="编码" prop="customerCode">
        <el-input
          v-model="queryParams.customerCode"
          placeholder="请输入编码"
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

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:customer:add']"
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
          v-hasPermi="['system:customer:edit']"
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
          v-hasPermi="['system:customer:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:customer:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->

    <el-table
      v-loading="loading"
      :data="customerList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="客户名称"
        align="center"
        prop="customerName"
        width="280"
      />
      <el-table-column
        label="简称"
        align="center"
        prop="shortName"
        width="180"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="编码"
        align="center"
        prop="customerCode"
        width="180"
      />
      <el-table-column
        label="联系人"
        align="center"
        prop="concatUser"
        width="180"
      />
      <el-table-column label="电话" align="center" prop="tel" width="180" />
      <el-table-column label="邮箱" align="center" prop="email" width="180" />
      <el-table-column label="国家" align="center" prop="country" />
      <el-table-column label="省" align="center" prop="province" width="180" />
      <el-table-column label="市" align="center" prop="city" width="180" />
      <el-table-column
        label="地址"
        align="center"
        prop="address"
        width="180"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="邮编" align="center" prop="zipCode" />
      <el-table-column label="描述" align="center" prop="remark" />
      <!-- <el-table-column label="企业key(E00002)" align="center" prop="enterpriseKey" /> -->
      <el-table-column
        label="企业信用统一编码"
        align="center"
        prop="enterpriseCode"
        width="180"
        :show-overflow-tooltip="true"
      />
      <!-- <el-table-column label="更新人" align="center" prop="updateUserName" />
      <el-table-column label=" 是否删除：0-未删除 1-已删除" align="center" prop="isDeleted" />
      <el-table-column label="开通账号" align="center" prop="openAccount" />
      <el-table-column label="开通账户状态：1-未开通 2-已开通" align="center" prop="status" />
      <el-table-column label="省-code" align="center" prop="provinceCode" />
      <el-table-column label="市-code" align="center" prop="cityCode" />
      <el-table-column label="创建人ID" align="center" prop="createUserId" />
      <el-table-column label="创建人" align="center" prop="createUserName" />
      <el-table-column label="区-中文" align="center" prop="region" />
      <el-table-column label="区-code" align="center" prop="regionCode" />
      <el-table-column label="类型id" align="center" prop="typeId" />
      <el-table-column label="类型名称" align="center" prop="typeName" />
      <el-table-column label="客户类型：大客户、经销商、零售客户、科研机构" align="center" prop="customerLevel" />
      <el-table-column label="授信期，eg：30" align="center" prop="creditPeriod" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:customer:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:customer:remove']"
          >删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改客户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="简称" prop="shortName">
          <el-input v-model="form.shortName" placeholder="请输入简称" />
        </el-form-item>
        <el-form-item label="编码" prop="customerCode">
          <el-input v-model="form.customerCode" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="联系人" prop="concatUser">
          <el-input v-model="form.concatUser" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="form.tel" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="国家" prop="country">
          <el-input v-model="form.country" placeholder="请输入国家" />
        </el-form-item>
        <el-form-item label="省-中文" prop="province">
          <el-input v-model="form.province" placeholder="请输入省-中文" />
        </el-form-item>
        <el-form-item label="市-中文" prop="city">
          <el-input v-model="form.city" placeholder="请输入市-中文" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="邮编" prop="zipCode">
          <el-input v-model="form.zipCode" placeholder="请输入邮编" />
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="企业key(E00002)" prop="enterpriseKey">
          <el-input
            v-model="form.enterpriseKey"
            placeholder="请输入企业key(E00002)"
          />
        </el-form-item>
        <el-form-item label="企业信用统一编码" prop="enterpriseCode">
          <el-input
            v-model="form.enterpriseCode"
            placeholder="请输入企业信用统一编码"
          />
        </el-form-item>
        <el-form-item label="更新人" prop="updateUserName">
          <el-input v-model="form.updateUserName" placeholder="请输入更新人" />
        </el-form-item>
        <el-form-item label=" 是否删除：0-未删除 1-已删除" prop="isDeleted">
          <el-input
            v-model="form.isDeleted"
            placeholder="请输入 是否删除：0-未删除 1-已删除"
          />
        </el-form-item>
        <el-form-item label="开通账号" prop="openAccount">
          <el-input v-model="form.openAccount" placeholder="请输入开通账号" />
        </el-form-item>
        <el-form-item label="省-code" prop="provinceCode">
          <el-input v-model="form.provinceCode" placeholder="请输入省-code" />
        </el-form-item>
        <el-form-item label="市-code" prop="cityCode">
          <el-input v-model="form.cityCode" placeholder="请输入市-code" />
        </el-form-item>
        <el-form-item label="创建人ID" prop="createUserId">
          <el-input v-model="form.createUserId" placeholder="请输入创建人ID" />
        </el-form-item>
        <el-form-item label="创建人" prop="createUserName">
          <el-input v-model="form.createUserName" placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item label="区-中文" prop="region">
          <el-input v-model="form.region" placeholder="请输入区-中文" />
        </el-form-item>
        <el-form-item label="区-code" prop="regionCode">
          <el-input v-model="form.regionCode" placeholder="请输入区-code" />
        </el-form-item>
        <el-form-item label="类型id" prop="typeId">
          <el-input v-model="form.typeId" placeholder="请输入类型id" />
        </el-form-item>
        <el-form-item label="类型名称" prop="typeName">
          <el-input v-model="form.typeName" placeholder="请输入类型名称" />
        </el-form-item>
        <el-form-item
          label="客户类型：大客户、经销商、零售客户、科研机构"
          prop="customerLevel"
        >
          <el-input
            v-model="form.customerLevel"
            placeholder="请输入客户类型：大客户、经销商、零售客户、科研机构"
          />
        </el-form-item>
        <el-form-item label="授信期，eg：30" prop="creditPeriod">
          <el-input
            v-model="form.creditPeriod"
            placeholder="请输入授信期，eg：30"
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
  listCustomer,
  getCustomer,
  delCustomer,
  addCustomer,
  updateCustomer,
} from "@/api/system/customer";

export default {
  name: "Customer",
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
      // 客户表格数据
      customerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        customerName: null,
        shortName: null,
        customerCode: null,
        concatUser: null,
        tel: null,
        email: null,
        country: null,
        province: null,
        city: null,
        address: null,
        zipCode: null,
        enterpriseKey: null,
        enterpriseCode: null,
        updateUserName: null,
        isDeleted: null,
        openAccount: null,
        status: null,
        provinceCode: null,
        cityCode: null,
        createUserId: null,
        createUserName: null,
        region: null,
        regionCode: null,
        typeId: null,
        typeName: null,
        customerLevel: null,
        creditPeriod: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        concatUser: [
          { required: true, message: "联系人不能为空", trigger: "blur" },
        ],
        tel: [{ required: true, message: "电话不能为空", trigger: "blur" }],
        isDeleted: [
          {
            required: true,
            message: " 是否删除：0-未删除 1-已删除不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询客户列表 */
    getList() {
      this.loading = true;
      listCustomer(this.queryParams).then((response) => {
        this.customerList = response.rows;
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
        customerName: null,
        shortName: null,
        customerCode: null,
        concatUser: null,
        tel: null,
        email: null,
        country: null,
        province: null,
        city: null,
        address: null,
        zipCode: null,
        remark: null,
        enterpriseKey: null,
        enterpriseCode: null,
        updateUserName: null,
        updateTime: null,
        isDeleted: null,
        openAccount: null,
        status: null,
        provinceCode: null,
        cityCode: null,
        createUserId: null,
        createUserName: null,
        createTime: null,
        region: null,
        regionCode: null,
        typeId: null,
        typeName: null,
        customerLevel: null,
        creditPeriod: null,
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
      this.title = "添加客户";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getCustomer(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改客户";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateCustomer(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCustomer(this.form).then((response) => {
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
        .confirm('是否确认删除客户编号为"' + ids + '"的数据项？')
        .then(function () {
          return delCustomer(ids);
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
        "system/customer/export",
        {
          ...this.queryParams,
        },
        `customer_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
