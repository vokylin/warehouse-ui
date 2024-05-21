<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--存储单元树-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="storageUnitName"
            placeholder="请输入存储单元名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="storageUnitOptions"
            :props="defaultProps"
            :default-expanded-keys="expandedList"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            node-key="id"
            :default-expand-all="isExpand"
            highlight-current
            @node-click="handleNodeClick"
            v-loading="treeLoading"
            @node-expand="nodeExpand"
            @node-collapse="nodeCollapse"
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['system:storageUnit:add']"
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
              v-hasPermi="['system:storageUnit:edit']"
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
              v-hasPermi="['system:storageUnit:remove']"
              >删除
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-col>
          <!--          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
        </el-row>

        <el-table
          v-loading="loading"
          :data="storageUnitList"
          @selection-change="handleSelectionChange"
          :default-sort="defaultSort"
          @sort-change="handleSortChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column
            label="名称"
            align="center"
            prop="name"
            width="180"
          />
          <el-table-column
            label="编码"
            align="center"
            prop="code"
            width="180"
          />
          <el-table-column
            label="存储单元类型"
            align="center"
            prop="storageUnitTypeName"
            width="180"
          />
          <el-table-column
            label="温层"
            align="center"
            prop="thermosphere"
            width="180"
          >
            <template slot-scope="scope">
              <dict-tag
                :options="dict.type.thermosphere"
                :value="scope.row.thermosphere"
              />
            </template>
          </el-table-column>

          <el-table-column
            label="描述"
            align="center"
            prop="description"
            width="120"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="是否最小存储单元"
            align="center"
            prop="isSmallestStorageUnit"
            width="180"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.isSmallestStorageUnit === 1">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
            width="120"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:storageUnit:edit']"
                >修改
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:storageUnit:remove']"
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

    <!-- 添加或修改存储单元对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="父级存储单元" prop="parentId">
          <treeselect
            v-model="form.parentId"
            :options="storageUnitOptions"
            :show-count="true"
            placeholder="请选择父级存储单元"
            @select="selectedParent"
          />
        </el-form-item>
        <!-- <el-form-item label="仓库类型" prop="storageUnitTypeCode">
          <treeselect
            v-model="form.storageUnitTypeCode"
            :options="storageUnitTypeOptions"
            :show-count="true"
            :normalizer="normalizer"
            placeholder="请选择仓库类型"
          />
        </el-form-item> -->

        <el-form-item label="存储单元类型" prop="storageUnitTypeCode">
          <el-select
            v-model="form.storageUnitTypeCode"
            placeholder="请选择存储单元类型"
            style="width: 100%"
          >
            <el-option
              v-for="dict in storageUnitTypeOptions"
              :key="dict.code"
              :label="dict.name"
              :value="dict.code"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="温层"
          prop="thermosphere"
          v-if="isShowThermosphere"
        >
          <el-select
            v-model="form.thermosphere"
            placeholder="请选择温层"
            style="width: 100%"
          >
            <el-option
              v-for="dict in dict.type.thermosphere"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="最小存储单元" prop="isSmallestStorageUnit">
          <el-radio-group v-model="form.isSmallestStorageUnit">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
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
  listStorageUnit,
  getStorageUnit,
  delStorageUnit,
  addStorageUnit,
  updateStorageUnit,
  treeStorageUnit,
} from "@/api/system/storageUnit";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
  treeStorageUnitType,
  storageUnitTypeSelectData,
} from "@/api/system/storageUnitType";

export default {
  name: "StorageUnit",
  dicts: ["thermosphere"],
  components: {
    Treeselect,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      treeLoading: true,
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
      // 存储单元表格数据
      storageUnitList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        code: null,
        parentId: "root",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        // warehouseId: [
        //   {required: true, message: '请选择所属仓库', trigger: 'change'}
        // ],
        thermosphere: [
          { required: true, message: "请选择温层", trigger: "change" },
        ],
        storageUnitTypeCode: [
          { required: true, message: "请选择存储单元类型", trigger: "change" },
        ],
        parentId: [
          { required: true, message: "请选择父级存储单元", trigger: "change" },
        ],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入编码", trigger: "blur" }],
      },
      // 存储单元名称
      storageUnitName: null,
      // 存储单元树结构
      storageUnitOptions: [],
      // 仓库下拉列表
      warehouseOptions: this.$store.getters.warehouses,
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 默认展开
      isExpand: false,
      // 当前选中节点
      currentData: null,
      // 是否显示温层
      isShowThermosphere: false,
      // 默认排序
      defaultSort: { prop: "createTime", order: "descending" },
      expandedList: [],
      storageUnitTypeOptions: [],
    };
  },
  watch: {
    // 监听存储单元名称
    storageUnitName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getList();
    this.getStorageUnitTree();
    this.getStorageUnitTypeTree();
  },
  methods: {
    /** 查询存储单元列表 */
    getList() {
      this.loading = true;
      listStorageUnit(this.queryParams).then((response) => {
        this.storageUnitList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 查询存储单元树结构 */
    getStorageUnitTree() {
      this.treeLoading = true;
      treeStorageUnit().then((response) => {
        this.storageUnitOptions = [];
        this.storageUnitOptions = response.data;
        this.treeLoading = false;
      });
    },

    /** 查询存储单元类型树结构 */
    getStorageUnitTypeTree() {
      // treeStorageUnitType().then((response) => {
      //   this.storageUnitTypeOptions = [];
      //   this.storageUnitTypeOptions = response.data;
      // });
      storageUnitTypeSelectData().then((response) => {
        this.storageUnitTypeOptions = [];
        this.storageUnitTypeOptions = response.data;
      });
    },

    // 数据转换
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.code,
        label: node.label,
        children: node.children,
      };
    },

    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.currentData = data;
      if (data.storageUnitType === 0) {
        this.queryParams.parentId = "";
        this.queryParams.warehouseId = data.id;
      } else {
        this.queryParams.warehouseId = "";
        this.queryParams.parentId = data.id;
      }
      this.handleQuery();
    },
    selectedParent(data) {
      this.currentData = data;
      this.isShowThermosphere = this.currentData.storageUnitType === 0;
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
        name: null,
        code: null,
        warehouseId: null,
        thermosphere: null,
        description: null,
        parentId: null,
        parentName: null,
        parentIds: null,
        isSmallestStorageUnit: 0,
        isDelete: null,
        createUserName: null,
        createBy: null,
        createTime: null,
        updateUserName: null,
        updateBy: null,
        updateTime: null,
        storageUnitTypeCode: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQueryParams() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        name: null,
        code: null,
        parentId: "root",
      };
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetQueryParams();
      this.handleQuery();
      this.warehouseOptions = this.$store.getters.warehouses;
      this.getStorageUnitTree();
      this.getStorageUnitTypeTree();
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
      if (this.currentData) {
        this.form.parentId = this.currentData.id;
        this.isShowThermosphere = this.currentData.storageUnitType === 0;
      } else {
        this.isShowThermosphere = false;
      }
      this.open = true;
      this.title = "添加存储单元";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getStorageUnit(id).then((response) => {
        this.form = response.data;
        // 如果选择的是根节点
        if (this.form.parentId === "root") {
          this.form.parentId = this.form.warehouseId;
          this.isShowThermosphere = true;
          this.form.thermosphere = this.form.thermosphere.toString();
        } else {
          this.isShowThermosphere = false;
        }

        this.open = true;
        this.title = "修改存储单元";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // 如果选择的是仓库
          if (this.currentData && this.currentData.storageUnitType === 0) {
            this.form.parentId = "root";
            this.form.warehouseId = this.currentData.id;
            this.isShowThermosphere = true;
          }
          if (this.form.id != null) {
            updateStorageUnit(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
              this.getStorageUnitTree();
            });
          } else {
            addStorageUnit(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
              this.getStorageUnitTree();
            });
          }
        }
      });
    },
    // 在节点展开是添加到默认展开数组
    nodeExpand(data) {
      this.expandedList.push(data.id);
    },
    // 收起时删除数组里对应选项
    nodeCollapse(data) {
      this.expandedList.splice(this.expandedList.indexOf(data.id), 1);
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm("是否确认删除选中的数据项？")
        .then(function () {
          return delStorageUnit(ids);
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
