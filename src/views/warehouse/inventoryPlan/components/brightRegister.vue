<template>
  <div class="app-container">
    <el-dialog
      title="盘点登记"
      :visible.sync="openVisible"
      width="100%"
      append-to-body
      :loading="loading"
    >
      <el-card class="box-card" body-style="padding='5px'">
        <el-row :gutter="10" class="mb8" style="margin-top: 10px">
          <el-col :span="1.5">
            <el-select
              v-model="queryParams.warehouseId"
              placeholder="请选择仓库"
              size="mini"
              @change="getList"
            >
              <el-option
                v-for="item in warehouseList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-col>
          <el-col :span="1.5">
            <el-input
              placeholder="请输入货品编码/名称"
              v-model="queryParams.itemCodeOrName"
              class="input-with-select"
              size="mini"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getList"
              ></el-button>
              <el-button
                slot="append"
                icon="el-icon-refresh"
                @click="resetQuery"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              size="mini"
              @click="handleBatchCommit"
              plain
              >批量提交</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" size="mini" @click="handleAdd" plain
              >增补</el-button
            >
          </el-col>
        </el-row>
        <el-table
          v-loading="loading"
          :data="inventoryList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column
            label="仓库"
            align="center"
            width="120"
            prop="warehouseName"
          />
          <el-table-column
            label="货位"
            align="center"
            width="120"
            prop="locationName"
          />
          <el-table-column
            label="物料名称"
            align="center"
            width="180"
            prop="itemName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="物料编码"
            align="center"
            width="180"
            prop="itemCode"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="物料批号"
            align="center"
            width="140"
            prop="batchNo"
          />
          <el-table-column label="单位" align="center" prop="unit" />
          <el-table-column
            label="单价"
            align="center"
            prop="price"
            width="160"
          />
          <el-table-column label="原始数量" align="center" prop="quantity" />
          <el-table-column
            label="盘点数量"
            align="center"
            prop="inventoryQuantity"
            width="120"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.inventoryQuantity"
                size="mini"
                @change="handleInventoryQuantityChange(scope.row)"
              ></el-input>
            </template>
          </el-table-column>

          <el-table-column
            label="差异数量"
            align="center"
            prop="diffQuantity"
          />
          <el-table-column label="库存状态" align="center" prop="storageStatus">
            <template slot-scope="scope">
              <dict-tag
                :options="dict.type.storage_status"
                :value="scope.row.storageStatus"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="是否提交"
            align="center"
            prop="isSave"
            width="120"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isSave === 0" type="danger"
                >未提交</el-tag
              >
              <el-tag v-if="scope.row.isSave === 1" type="success"
                >已提交</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            label="生产日期"
            align="center"
            prop="productDate"
            width="180"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.productDate, "{y}-{m}-{d}") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="差异分析"
            align="center"
            prop="diffAnalysis"
            width="180"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.diffAnalysis"
                placeholder="请输入差异分析"
                size="mini"
              />
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="120"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-finished"
                @click="handleCommit(scope.row)"
                >提交</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                v-if="scope.row.isAdd === 1"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          small
          layout="total,prev, pager, next"
          v-show="inventoryTotal > 0"
          :total="inventoryTotal"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="仓库" prop="warehouseId">
          <el-select
            v-model="form.warehouseId"
            placeholder="请选择仓库"
            style="width: 100%"
            filterable
            @change="getStorageUnitTree"
          >
            <el-option
              v-for="item in warehouseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="货位" prop="locationId">
          <el-cascader
            v-model="form.locationId"
            placeholder="请选择货位"
            ref="loactionSelect"
            :disabled="!form.warehouseId"
            :options="storageUnitOptions"
            :key="cascaderKey"
            style="width: 100%"
            :props="{
              value: 'id',
              emitPath: false,
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="物料" prop="itemCode">
          <el-select
            v-model="form.itemCode"
            filterable
            remote
            reserve-keyword
            placeholder="请输入物料名称/编码"
            :remote-method="getItemList"
            :loading="itemLoading"
            style="width: 100%"
            @change="handleItemChange"
          >
            <el-option
              v-for="item in itemList"
              :key="item.productCode"
              :label="item.productCode + ' / ' + item.productName"
              :value="item.productCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="批次" prop="batchNo">
          <el-input v-model="form.batchNo" placeholder="请输入批次" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input disabled v-model="form.unit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="盘点数量" prop="inventoryQuantity">
          <el-input
            v-model="form.inventoryQuantity"
            placeholder="请输入盘点数量"
          />
        </el-form-item>
        <el-form-item label="库存状态" prop="storageStatus">
          <el-select
            v-model="form.storageStatus"
            placeholder="请选择库存状态"
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
        <el-form-item label="生产日期" prop="productDate">
          <el-date-picker
            clearable
            v-model="form.productDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择生产日期"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="dialogCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listInventoryDetail,
  getInventoryDetail,
  delInventoryDetail,
  addInventoryDetail,
  updateInventoryDetailBatch,
  updateInventoryDetail,
} from "@/api/warehouse/inventoryDetail";
import { subtract } from "@/utils/math";
import { getWarehouseList } from "@/api/system/warehouse";
import { treeStorageUnit } from "@/api/system/storageUnit";
import Treeselect from "@riophae/vue-treeselect";
import { listProductInfo } from "@/api/system/productInfo";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "work",
  dicts: ["storage_status"],
  components: {
    Treeselect,
  },
  props: {},
  data() {
    return {
      // 弹窗是否显示
      openVisible: false,
      // 加载状态
      loading: false,
      breakageloading: false,
      inventoryPlanData: {},
      // 库存明细数据
      inventoryList: [],
      inventoryTotal: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemCodeOrName: "",
        warehouseId: "",
        inventoryId: "",
      },
      ids: [],
      selection: [],
      // 仓库下拉框数据
      warehouseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        warehouseId: [
          { required: true, message: "请选择仓库", trigger: "blur" },
        ],
        locationId: [
          { required: true, message: "请选择货位", trigger: "blur" },
        ],
        itemCode: [{ required: true, message: "请选择物料", trigger: "blur" }],
        batchNo: [{ required: true, message: "请输入批次", trigger: "blur" }],
        inventoryQuantity: [
          { required: true, message: "请输入盘点数量", trigger: "blur" },
        ],
        storageStatus: [
          { required: true, message: "请选择库存状态", trigger: "blur" },
        ],
        productDate: [
          { required: true, message: "请选择生产日期", trigger: "blur" },
        ],
      },
      // 库位下拉框数据
      storageUnitOptions: [],
      cascaderKey: 1,
      // 物料下拉框数据
      itemList: [],
      itemLoading: false,
      // 表格数据缓存
      tempTableData: [],
    };
  },
  created() {},
  watch: {
    //切换数据源
    change() {
      ++this.cascaderKey;
    },
  },

  methods: {
    // 获取列表数据
    start(rowData) {
      this.openVisible = true;
      this.loading = true;
      this.tempTableData = [];
      this.inventoryPlanData = rowData;
      this.getWarehouseList();
      this.getList();
    },

    /** 查询库存货品列表 */
    getList() {
      this.loading = true;
      this.queryParams.inventoryId = this.inventoryPlanData.id;
      listInventoryDetail(this.queryParams).then((response) => {
        let tableDate = response.rows;
        if (this.tempTableData.length > 0) {
          // 将临时表格上的 盘点数量 差异分析 保存到新的表格数据中
          this.tempTableData.forEach((item) => {
            tableDate.forEach((newItem) => {
              if (item.id == newItem.id) {
                newItem.inventoryQuantity = item.inventoryQuantity;
                newItem.diffAnalysis = item.diffAnalysis;
                newItem.diffQuantity = item.diffQuantity;
              }
            });
          });
        }
        this.inventoryList = tableDate;
        this.inventoryTotal = response.total;
        this.loading = false;
      });
    },

    // 表单重置
    reset() {
      this.form = {
        id: null,
        inventoryId: null,
        warehouseId: null,
        locationId: null,
        itemCode: null,
        itemName: null,
        unit: null,
        price: null,
        batchNo: null,
        quantity: null,
        inventoryQuantity: null,
        diffQuantity: null,
        storageStatus: null,
        productDate: null,
        isSave: null,
        isAdd: null,
        diffAnalysis: null,
        analysisConclusion: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
      };
      this.resetForm("form");
    },

    /** 获取仓库下拉框数据 */
    getWarehouseList() {
      getWarehouseList().then((response) => {
        this.warehouseList = response.data;
        const warehouseIdArr = this.inventoryPlanData.warehouseIds.split(",");
        this.warehouseList = this.warehouseList.filter((item) => {
          return warehouseIdArr.includes(item.id);
        });
      });
    },

    /** 查询存储单元树结构 */
    getStorageUnitTree() {
      this.storageUnitOptions = [];
      this.treeLoading = true;
      treeStorageUnit({
        isSmallestStorageUnit: 1,
        warehouseId: this.form.warehouseId,
      }).then((response) => {
        this.storageUnitOptions = response.data;
        // 处理树结构
        this.handleTreeData(this.storageUnitOptions);
        this.treeLoading = false;
      });
    },

    /**处理树结果数据 */
    handleTreeData(data) {
      data.forEach((item) => {
        if (item.children) {
          this.handleTreeData(item.children);
        } else {
          item.disabled = item.isSmallestStorageUnit == 1 ? false : true;
        }
      });
    },

    // 获取物料下拉框数据
    getItemList(query) {
      this.itemLoading = true;
      listProductInfo({ itemCodeOrName: query })
        .then((response) => {
          this.itemList = response.rows;
          this.itemLoading = false;
        })
        .catch(() => {
          this.itemLoading = false;
        });
    },

    // 重置查询条件
    resetQuery() {
      this.queryParams.itemCodeOrName = "";
      this.queryParams.warehouseId = "";
      this.getList();
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.selection = selection;
    },

    // 取消按钮
    cancel() {
      this.tempTableData = [];
      this.inventoryPlanData = {};
      this.inventoryList = [];
      this.openVisible = false;
    },
    // 确定按钮
    submit() {
      this.tempTableData = [];
      this.inventoryPlanData = {};
      this.inventoryList = [];
      this.openVisible = false;
    },

    // 提交
    handleCommit(row) {
      if (!this.checkCommit(row)) {
        return;
      }
      if (row.inventoryQuantity === 0) {
        row.diffQuantity = subtract(row.inventoryQuantity, row.quantity);
      }
      this.tempTableData = this.inventoryList;
      updateInventoryDetail(row).then((response) => {
        this.$message.success("提交成功");
        this.getList();
      });
    },
    // 批量提交
    handleBatchCommit() {
      if (this.selection.length == 0) {
        this.$message.warning("请选择要提交的数据");
        return;
      }
      try {
        this.selection.forEach((item) => {
          if (!this.checkCommit(item)) {
            throw new Error("error");
          }
        });
      } catch (e) {
        return;
      }
      this.selection.forEach((item) => {
        if (item.inventoryQuantity === 0) {
          item.diffQuantity = subtract(item.inventoryQuantity, item.quantity);
        }
      });
      updateInventoryDetailBatch(this.selection).then((response) => {
        this.$message.success("提交成功");
        this.getList();
      });
    },

    // 校验是否可以提交
    checkCommit(row) {
      if (row.inventoryQuantity === null || row.inventoryQuantity === "") {
        this.$message.error("请输入盘点数量");
        return false;
      }
      // 正则校验
      const reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
      if (!reg.test(row.inventoryQuantity)) {
        this.$message.error("盘点数量格式不正确");
        return false;
      }
      if (row.inventoryQuantity < 0) {
        this.$message.error("盘点数量不能小于0");
        return false;
      }
      return true;
    },

    // 盘点数量变化
    handleInventoryQuantityChange(row) {
      row.diffQuantity = subtract(row.inventoryQuantity, row.quantity);
    },

    // 增补库存
    handleAdd() {
      this.open = true;
      this.title = "增补库存";
      this.reset();
      this.form = {
        inventoryId: this.inventoryPlanData.id,
      };
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.tempTableData = this.inventoryList;
          addInventoryDetail(this.form).then((response) => {
            this.$modal.msgSuccess("新增成功");
            this.open = false;
            this.getList();
            this.reset();
          });
        }
      });
    },

    /** 删除按钮 */
    handleDelete(row) {
      this.$confirm("是否确认删除该条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delInventoryDetail(row.id).then((response) => {
            this.$message.success("删除成功");
            this.getList();
          });
        })
        .catch(() => {});
    },

    // 弹窗取消按钮
    dialogCancel() {
      this.open = false;
      this.reset();
    },

    // 选择物料
    handleItemChange(val) {
      const item = this.itemList.find((item) => item.productCode == val);
      this.form.unit = item.masterUnit;
    },
  },
};
</script>
