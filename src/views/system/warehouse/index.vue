<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="companyName"
            placeholder="请输入公司名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container tree">
          <el-tree
            :data="companyOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          >
          <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span v-if="data.craft_code != null"
                >({{ data.craft_code }})
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>

      <el-col :span="20" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="仓库编码" prop="code">
            <el-input
              v-model="queryParams.code"
              placeholder="请输入仓库编码"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="仓库名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入仓库名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="仓库类型" prop="type">
            <el-select v-model="queryParams.type" placeholder="请选择类型">
              <el-option
                v-for="dict in dict.type.warehouse_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
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
              v-hasPermi="['system:warehouse:add']"
              >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:warehouse:edit']"
              >修改
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:warehouse:remove']"
              >删除
            </el-button>
          </el-col>
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getList"
          ></right-toolbar>
        </el-row>
        <el-table
          v-loading="loading"
          :data="warehouseList"
          @selection-change="handleSelectionChange"
          :default-sort="defaultSort"
          @sort-change="handleSortChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column
            label="仓库编码"
            width="120"
            align="center"
            prop="code"
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
          />
          <el-table-column
            label="仓库名称"
            width="120"
            align="center"
            prop="name"
            :show-overflow-tooltip="true"
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
          />
          <el-table-column
            label="所属公司"
            width="200"
            align="center"
            prop="belongCompanyName"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="联系人" align="center" prop="contractUser" />
          <el-table-column
            label="联系电话"
            width="120"
            align="center"
            prop="contractPhone"
          />
          <el-table-column
            label="邮箱"
            width="180"
            align="center"
            prop="email"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="类型" width="120" align="center" prop="type">
            <template slot-scope="scope">
              <dict-tag
                :options="dict.type.warehouse_type"
                :value="scope.row.type"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            align="center"
            prop="remark"
            width="120"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="创建时间"
            align="center"
            prop="createTime"
            width="180"
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
          >
            <template slot-scope="scope">
              <span>{{
                parseTime(scope.row.createTime, "{y}-{m}-{d} {h}:{i}:{s}")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="修改时间"
            align="center"
            prop="updateTime"
            width="180"
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
          >
            <template slot-scope="scope">
              <span>{{
                parseTime(scope.row.updateTime, "{y}-{m}-{d} {h}:{i}:{s}")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            class-name="small-padding fixed-width"
            width="120"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:warehouse:edit']"
                >修改
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:warehouse:remove']"
                >删除
              </el-button>
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
      </el-col>
    </el-row>

    <!-- 添加或修改仓库对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="仓库编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入仓库编码" />
        </el-form-item>
        <el-form-item label="仓库名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入仓库名称" />
        </el-form-item>

        <el-form-item label="所属公司" prop="belongCompany">
          <treeselect
            v-model="form.belongCompany"
            :options="companyOptions"
            :show-count="true"
            placeholder="请选择所属公司"
          />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select
            v-model="form.type"
            placeholder="请选择类型"
            style="width: 100%"
          >
            <el-option
              v-for="dict in dict.type.warehouse_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="contractUser">
          <el-input v-model="form.contractUser" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="contractPhone">
          <el-input v-model="form.contractPhone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
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
  listWarehouse,
  getWarehouse,
  delWarehouse,
  addWarehouse,
  updateWarehouse,
} from "@/api/system/warehouse";
import company from "@/views/system/company/index.vue";
import { companyTreeSelect } from "@/api/system/user";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Warehouse",
  computed: {
    company() {
      return company;
    },
  },
  components: {
    Treeselect,
  },
  dicts: ["warehouse_type"],
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
      // 仓库表格数据
      warehouseList: [],
      // 公司树形数据
      companyOptions: undefined,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        code: null,
        name: null,
        belongCompany: null,
        type: null,
      },
      // 公司名称
      companyName: undefined,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        code: [
          { required: true, message: "请输入仓库编码", trigger: "blur" },
        ],
        name: [
          { required: true, message: "请输入仓库名称", trigger: "blur" },
        ],
        type: [
          { required: true, message: "请选择仓库类型", trigger: "blur" },
        ],
        belongCompany: [
          { required: true, message: "请选择所属公司", trigger: "blur" },
        ],

      },
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 默认排序
      defaultSort: { prop: "createTime", order: "descending" },
    };
  },
  watch: {
    // 监听公司名称
    companyName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getList();
    this.getCompanyTree();
  },
  methods: {
    /** 查询仓库列表 */
    getList() {
      this.loading = true;
      listWarehouse(this.queryParams).then((response) => {
        this.warehouseList = response.rows;
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
        code: null,
        name: null,
        belongCompany: null,
        contractUser: null,
        contractPhone: null,
        email: null,
        type: null,
        remark: null,
        isDelete: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
      };
      this.resetForm("form");
    },
    /** 查询部门下拉树结构 */
    getCompanyTree() {
      companyTreeSelect().then((response) => {
        this.companyOptions = response.data;
      });
    },

    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.belongCompany = data.id;
      this.handleQuery();
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form.belongCompany = this.queryParams.belongCompany;
      this.open = true;
      this.title = "添加仓库";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getWarehouse(id).then((response) => {
        this.form = response.data;
        this.form.type = this.form.type.toString();
        this.open = true;
        this.title = "修改仓库";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateWarehouse(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWarehouse(this.form).then((response) => {
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
        .confirm(`是否确认删除选中的仓库?`)
        .then(function () {
          return delWarehouse(ids);
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
        "system/warehouse/export",
        {
          ...this.queryParams,
        },
        `warehouse_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.tree {
    ::v-deep .el-tree-node {
      white-space: normal;
      .el-tree-node__content {
        height: 100%;
        align-items: start;
      }
    }
  }

</style>