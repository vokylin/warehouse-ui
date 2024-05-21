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
      <el-form-item label="公司编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入公司编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公司名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入公司名称"
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
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:company:add']"
          >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
          >展开/折叠
        </el-button>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="companyList"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="公司名称" prop="name" width="260" />
      <el-table-column label="公司编码" prop="id" width="200" />
      <el-table-column label="联系人" prop="contactUser" />
      <el-table-column label="联系电话" width="120" prop="contactPhone" />
      <el-table-column label="联系邮箱" width="160" prop="email" />
      <el-table-column label="邮编" width="120" prop="postCode" />
      <el-table-column label="省" prop="province" />
      <el-table-column label="市" prop="city" />
      <el-table-column label="区" prop="county" />
      <el-table-column
        label="详细地址"
        width="160"
        prop="address"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="备注"
        prop="remark"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="操作"
        fixed="right"
        width="180"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:company:add']"
            >新增
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:company:edit']"
            >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-if="scope.row.parentId != 'root'"
            v-hasPermi="['system:company:remove']"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加或修改公司管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 'root'">
            <el-form-item label="上级部门" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="companyTreeOptions"
                :normalizer="normalizer"
                placeholder="选择上级部门"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="公司编码" prop="id">
              <el-input
                v-model="form.id"
                :disabled="form.code"
                placeholder="请输入公司编码"
              />
            </el-form-item>
            <el-form-item label="公司名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入公司名称" />
            </el-form-item>
            <el-form-item label="联系人" prop="contactUser">
              <el-input v-model="form.contactUser" placeholder="请输入联系人" />
            </el-form-item>
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input
                v-model="form.contactPhone"
                placeholder="请输入联系电话"
              />
            </el-form-item>
            <el-form-item label="联系邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入联系邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮编" prop="postCode">
              <el-input v-model="form.postCode" placeholder="请输入邮编" />
            </el-form-item>
            <el-form-item label="省" prop="province">
              <el-input v-model="form.province" placeholder="请输入省" />
            </el-form-item>
            <el-form-item label="市" prop="city">
              <el-input v-model="form.city" placeholder="请输入市" />
            </el-form-item>
            <el-form-item label="区" prop="county">
              <el-input v-model="form.county" placeholder="请输入区" />
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入详细地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                v-model="form.remark"
                placeholder="请输入备注"
              />
            </el-form-item>
          </el-col>
        </el-row>
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
  listCompany,
  getCompany,
  delCompany,
  addCompany,
  updateCompany,
  listCompanyExcludeChild,
} from "@/api/system/company";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Company",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 公司管理表格数据
      companyList: [],
      // 公司管理树形数据
      companyTreeOptions: [],
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 显示搜索条件
      showSearch: true,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        code: null,
        name: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "请选择上级部门", trigger: "blur" },
        ],
        id: [
          { required: true, message: "请输入公司编码", trigger: "blur" },
          {
            min: 1,
            max: 64,
            message: "长度在 1 到 64 个字符",
            trigger: "blur",
          },
        ],
        name: [
          { required: true, message: "请输入公司名称", trigger: "blur" },
          {
            min: 1,
            max: 64,
            message: "长度在 1 到 64 个字符",
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
    /** 查询公司管理列表 */
    getList() {
      this.loading = true;
      listCompany(this.queryParams).then((response) => {
        this.companyList = this.handleTree(response.data, "id", "parentId");
        console.log("companyList", this.companyList);
        this.loading = false;
      });
    },

    /** 转换公司数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
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
        code: null,
        name: null,
        contactUser: null,
        contactPhone: null,
        email: null,
        postCode: null,
        province: null,
        city: null,
        county: null,
        address: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        isDelete: null,
        parentId: null,
        parentIds: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
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
    handleAdd(row) {
      this.reset();
      if (row != undefined) {
        this.form.parentId = row.id;
      }
      this.open = true;
      this.title = "添加公司";
      listCompany().then((response) => {
        this.companyTreeOptions = this.handleTree(
          response.data,
          "id",
          "parentId"
        );
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getCompany(id).then((response) => {
        this.form = response.data;
        this.form.code = response.data.id;
        this.open = true;
        this.title = "修改公司管理";

        // 排除当前节点及子节点
        listCompanyExcludeChild(id).then((response) => {
          this.companyTreeOptions = this.handleTree(
            response.data,
            "id",
            "parentId"
          );
        });
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.code != null) {
            updateCompany(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCompany(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除公司管理编号为"' + ids + '"的数据项？')
        .then(function () {
          return delCompany(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
  },
};
</script>
