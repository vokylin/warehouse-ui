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
      <el-form-item label="编码" prop="logisticsCode">
        <el-input
          v-model="queryParams.logisticsCode"
          placeholder="请输入编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="名称" prop="logisticsName">
        <el-input
          v-model="queryParams.logisticsName"
          placeholder="请输入名称"
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
    <!-- 
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:logistics:add']"
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
          v-hasPermi="['system:logistics:edit']"
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
          v-hasPermi="['system:logistics:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:logistics:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->

    <el-table
      v-loading="loading"
      :data="logisticsList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="ID" align="center" prop="id" /> -->
      <el-table-column
        label="名称"
        align="center"
        prop="logisticsName"
        width="280"
      />
      <el-table-column
        label="编码"
        align="center"
        prop="logisticsCode"
        width="180"
      />
      <el-table-column
        label="联系人"
        align="center"
        prop="contacts"
        width="180"
      />
      <el-table-column
        label="联系人电话"
        align="center"
        prop="contactsTel"
        width="180"
      />
      <el-table-column
        label="联系人邮箱"
        align="center"
        prop="contactsEmail"
        width="180"
      />
      <el-table-column label="国家" align="center" prop="country" />
      <el-table-column label="省" align="center" prop="province" />
      <el-table-column label="市" align="center" prop="city" />
      <el-table-column label="区" align="center" prop="region" />
      <el-table-column
        label="地址"
        align="center"
        prop="address"
        width="180"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="邮编" align="center" prop="zipCode" />
      <el-table-column
        label="描述"
        align="center"
        prop="description"
        width="180"
        :show-overflow-tooltip="true"
      />
      <!-- <el-table-column label="开通账户状态：0-正常 1-停用" align="center" prop="status" />
      <el-table-column label="创建人id" align="center" prop="createId" />
      <el-table-column label="创建时间" align="center" prop="createDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否删除：0-未删除 1-已删除" align="center" prop="isDeleted" />
      <el-table-column label="企业信用统一编码" align="center" prop="enterpriseCode" />
      <el-table-column label="省-code" align="center" prop="provinceCode" />
      <el-table-column label="市-code" align="center" prop="cityCode" />
      <el-table-column label="区-code" align="center" prop="regionCode" />
      <el-table-column label="简称" align="center" prop="shortName" />
      <el-table-column label="企业key(E00002) 创建人的企业Key" align="center" prop="enterpriseKey" />
      <el-table-column label="审核状态：0-待提交审核；1-拒绝；2-已通过；3-审核中" align="center" prop="auditStatus" />
      <el-table-column label="经营范围" align="center" prop="managerScope" />
      <el-table-column label="类型" align="center" prop="type" />
      <el-table-column label="申请类型：add-新增；update-修改" align="center" prop="applyType" />
      <el-table-column label="证件过期锁定: 1- 证件过期锁定  2- 未锁定" align="center" prop="locked" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:logistics:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:logistics:remove']"
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

    <!-- 添加或修改承运商对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="编码" prop="logisticsCode">
          <el-input v-model="form.logisticsCode" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="名称" prop="logisticsName">
          <el-input v-model="form.logisticsName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input v-model="form.contacts" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系人电话" prop="contactsTel">
          <el-input v-model="form.contactsTel" placeholder="请输入联系人电话" />
        </el-form-item>
        <el-form-item label="联系人邮箱" prop="contactsEmail">
          <el-input
            v-model="form.contactsEmail"
            placeholder="请输入联系人邮箱"
          />
        </el-form-item>
        <el-form-item label="国家" prop="country">
          <el-input v-model="form.country" placeholder="请输入国家" />
        </el-form-item>
        <el-form-item label="省" prop="province">
          <el-input v-model="form.province" placeholder="请输入省" />
        </el-form-item>
        <el-form-item label="市" prop="city">
          <el-input v-model="form.city" placeholder="请输入市" />
        </el-form-item>
        <el-form-item label="区-中文" prop="region">
          <el-input v-model="form.region" placeholder="请输入区-中文" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="邮编" prop="zipCode">
          <el-input v-model="form.zipCode" placeholder="请输入邮编" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="创建人id" prop="createId">
          <el-input v-model="form.createId" placeholder="请输入创建人id" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createDate">
          <el-date-picker
            clearable
            v-model="form.createDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择创建时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="更新时间" prop="updateDate">
          <el-date-picker
            clearable
            v-model="form.updateDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择更新时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否删除：0-未删除 1-已删除" prop="isDeleted">
          <el-input
            v-model="form.isDeleted"
            placeholder="请输入是否删除：0-未删除 1-已删除"
          />
        </el-form-item>
        <el-form-item label="企业信用统一编码" prop="enterpriseCode">
          <el-input
            v-model="form.enterpriseCode"
            placeholder="请输入企业信用统一编码"
          />
        </el-form-item>
        <el-form-item label="省-code" prop="provinceCode">
          <el-input v-model="form.provinceCode" placeholder="请输入省-code" />
        </el-form-item>
        <el-form-item label="市-code" prop="cityCode">
          <el-input v-model="form.cityCode" placeholder="请输入市-code" />
        </el-form-item>
        <el-form-item label="区-code" prop="regionCode">
          <el-input v-model="form.regionCode" placeholder="请输入区-code" />
        </el-form-item>
        <el-form-item label="简称" prop="shortName">
          <el-input v-model="form.shortName" placeholder="请输入简称" />
        </el-form-item>
        <el-form-item
          label="企业key(E00002) 创建人的企业Key"
          prop="enterpriseKey"
        >
          <el-input
            v-model="form.enterpriseKey"
            placeholder="请输入企业key(E00002) 创建人的企业Key"
          />
        </el-form-item>
        <el-form-item label="经营范围" prop="managerScope">
          <el-input v-model="form.managerScope" placeholder="请输入经营范围" />
        </el-form-item>
        <el-form-item
          label="证件过期锁定: 1- 证件过期锁定  2- 未锁定"
          prop="locked"
        >
          <el-input
            v-model="form.locked"
            placeholder="请输入证件过期锁定: 1- 证件过期锁定  2- 未锁定"
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
  listLogistics,
  getLogistics,
  delLogistics,
  addLogistics,
  updateLogistics,
} from "@/api/system/logistics";

export default {
  name: "Logistics",
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
      // 承运商表格数据
      logisticsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        logisticsCode: null,
        logisticsName: null,
        contacts: null,
        contactsTel: null,
        contactsEmail: null,
        country: null,
        province: null,
        city: null,
        region: null,
        address: null,
        zipCode: null,
        description: null,
        status: null,
        createId: null,
        createDate: null,
        updateDate: null,
        isDeleted: null,
        enterpriseCode: null,
        provinceCode: null,
        cityCode: null,
        regionCode: null,
        shortName: null,
        enterpriseKey: null,
        auditStatus: null,
        managerScope: null,
        type: null,
        applyType: null,
        locked: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        createBy: [
          {
            required: true,
            message: "创建人(对应sys_user表主键)不能为空",
            trigger: "blur",
          },
        ],
        isDeleted: [
          {
            required: true,
            message: "是否删除：0-未删除 1-已删除不能为空",
            trigger: "blur",
          },
        ],
        enterpriseKey: [
          {
            required: true,
            message: "企业key(E00002) 创建人的企业Key不能为空",
            trigger: "blur",
          },
        ],
        applyType: [
          {
            required: true,
            message: "申请类型：add-新增；update-修改不能为空",
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询承运商列表 */
    getList() {
      this.loading = true;
      listLogistics(this.queryParams).then((response) => {
        this.logisticsList = response.rows;
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
        logisticsCode: null,
        logisticsName: null,
        contacts: null,
        contactsTel: null,
        contactsEmail: null,
        country: null,
        province: null,
        city: null,
        region: null,
        address: null,
        zipCode: null,
        description: null,
        status: null,
        createId: null,
        createBy: null,
        createDate: null,
        updateBy: null,
        updateDate: null,
        isDeleted: null,
        enterpriseCode: null,
        provinceCode: null,
        cityCode: null,
        regionCode: null,
        shortName: null,
        enterpriseKey: null,
        auditStatus: null,
        managerScope: null,
        type: null,
        applyType: null,
        locked: null,
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
      this.title = "添加承运商";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getLogistics(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改承运商";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateLogistics(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addLogistics(this.form).then((response) => {
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
        .confirm('是否确认删除承运商编号为"' + ids + '"的数据项？')
        .then(function () {
          return delLogistics(ids);
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
        "system/logistics/export",
        {
          ...this.queryParams,
        },
        `logistics_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
