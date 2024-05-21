<template>
  <div class="app-container">
    <el-dialog
      title="调拨分配"
      :visible.sync="openVisible"
      width="95%"
      :loading="loading"
      append-to-body
    >
      <el-dialog
        title="确认信息"
        :visible.sync="innerVisible"
        width="25%"
        append-to-body
        center
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="出库收发类别" prop="deliveryType">
            <el-select
              v-model="form.deliveryType"
              placeholder="请选择出库收发类别"
              filterable
            >
              <el-option
                v-for="dict in dict.type.delivery_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="入库收发类别" prop="receiveType">
            <el-select
              v-model="form.receiveType"
              placeholder="请选择入库收发类别"
              filterable
            >
              <el-option
                v-for="dict in dict.type.receive_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发生时间" prop="occTime">
            <el-date-picker
              v-model="form.occTime"
              type="datetime"
              placeholder="请选择发生时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancelSubmit">取 消</el-button>
        </div>
      </el-dialog>

      <el-card class="box-card" body-style="padding='5px'">
        <div slot="header" class="clearfix">
          <span>调拨出库</span>
        </div>
        <el-row :gutter="10" class="mb8" style="margin-top: 10px">
          <el-col :span="1.5">
            <el-select
              v-model="detailTableQueryParams.warehouseId"
              placeholder="请选择仓库"
              size="mini"
              @change="changeSourceWarehouse"
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
              v-model="detailTableQueryParams.itemCodeOrName"
              class="input-with-select"
              size="mini"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getItemStorageDetailList"
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
              @click="handleAllotBatch"
              plain
              >批量分配</el-button
            >
          </el-col>
        </el-row>
        <el-table
          v-loading="detailTableLoading"
          :data="detailTableList"
          :key="sourceStorageKey"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column
            label="仓库"
            align="center"
            prop="warehouseName"
            width="120"
          />
          <el-table-column label="货位" align="center" prop="locationName" />
          <el-table-column
            label="物料名称"
            align="center"
            width="240"
            prop="itemName"
          />
          <el-table-column
            label="物料编码"
            align="center"
            width="240"
            prop="itemCode"
          />
          <el-table-column
            label="物料批号"
            align="center"
            width="120"
            prop="batchNo"
          />
          <el-table-column label="数量" align="center" prop="quantity" />
          <el-table-column label="单位" align="center" prop="unit" />
          <el-table-column
            label="生产日期"
            align="center"
            prop="productDate"
            width="180"
          >
            <template slot-scope="scope">
              <span>{{
                parseTime(scope.row.productDate, "{y}-{m}-{d}")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="过期日期"
            align="center"
            prop="expireDate"
            width="180"
          >
            <template slot-scope="scope">
              <span>{{
                parseTime(scope.row.expireDate, "{y}-{m}-{d}")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="分配数量"
            align="center"
            fixed="right"
            prop="allotQuantity"
            width="80"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.allotQuantity"
                size="mini"
              ></el-input>
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
                @click="handleAllot(scope.row)"
                v-if="scope.row.allotQuantity > 0"
                >分配</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          small
          layout="total,prev, pager, next"
          v-show="detailTableTotal > 0"
          :total="detailTableTotal"
          :page.sync="detailTableQueryParams.pageNum"
          :limit.sync="detailTableQueryParams.pageSize"
          @pagination="getItemStorageDetailList"
        />
      </el-card>

      <el-card class="box-card" body-style="padding='5px'">
        <div slot="header" class="clearfix">
          <span>调拨入库</span>
        </div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-select
              v-model="targetWarehouseId"
              placeholder="请选择调入仓库"
              clearable
              size="mini"
              @change="handleChangeWarehouse"
              ref="warehouseSelect"
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
            <el-cascader
              v-model="targetLocationId"
              placeholder="批量分配库位"
              ref="loactionSelect"
              :options="storageUnitOptions"
              :show-all-levels="true"
              :props="{
                value: 'id',
                emitPath: false,
              }"
              size="mini"
              :disabled="!targetWarehouseId"
              @change="handleChangeLocation()"
            ></el-cascader>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" size="mini" plain @click="handleCancelAll"
              >批量取消</el-button
            >
          </el-col>
        </el-row>
        <el-table
          v-loading="allotTableLoading"
          :data="allotList"
          :key="targetStorageKey"
          @selection-change="handleSelectionChangeAllot"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column
            label="原仓库"
            align="center"
            prop="warehouseName"
            width="120"
          />
          <el-table-column label="原货位" align="center" prop="locationName" />
          <el-table-column
            label="物料批号"
            width="120"
            align="center"
            prop="batchNo"
          />
          <el-table-column
            label="物料名称"
            align="center"
            width="240"
            prop="itemName"
          />
          <el-table-column
            label="物料编码"
            align="center"
            width="240"
            prop="itemCode"
          />
          <el-table-column label="数量" align="center" prop="allotQuantity" />
          <el-table-column label="单位" align="center" prop="unit" />
          <el-table-column
            label="生产日期"
            align="center"
            prop="productDate"
            width="180"
          >
            <template slot-scope="scope">
              <span>{{
                parseTime(scope.row.productDate, "{y}-{m}-{d}")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="过期日期"
            align="center"
            prop="expireDate"
            width="180"
          >
            <template slot-scope="scope">
              <span>{{
                parseTime(scope.row.expireDate, "{y}-{m}-{d}")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="目标仓库"
            align="center"
            prop="targetWarehouseName"
            width="120"
            fixed="right"
          />
          <el-table-column
            label="目标位置"
            fixed="right"
            width="180"
            align="center"
            prop="targetLocationId"
          >
            <template slot-scope="scope">
              <el-cascader
                size="mini"
                v-model="scope.row.targetLocationId"
                :options="storageUnitOptions"
                :show-all-levels="true"
                :props="{
                  value: 'id',
                  emitPath: false,
                }"
              ></el-cascader>
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
                icon="el-icon-close"
                @click="handleCancel(scope.row)"
                >取消</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          small
          layout="total,prev, pager, next"
          v-show="allotListTotal > 0"
          :total="allotListTotal"
          :page.sync="allotListQueryParams.pageNum"
          :limit.sync="allotListQueryParams.pageSize"
          @pagination="getAllotList"
        />
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listItemStorageDetailByUser,
  transferItemStorageDetail,
} from "@/api/warehouse/itemStorageDetail";
import { treeStorageUnit } from "@/api/system/storageUnit";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { add } from "@/utils/math"; // 精度计算
import { getWarehouseList } from "@/api/system/warehouse";
export default {
  name: "displacement",
  dicts: [
    "storage_status",
    "work_status",
    "relate_type",
    "receive_type",
    "delivery_type",
  ],
  components: {
    Treeselect,
  },
  props: {},
  data() {
    return {
      // 弹窗是否显示
      openVisible: false,
      // 内部弹窗是否显示
      innerVisible: false,
      // 加载状态
      loading: false,
      detailTableLoading: false,
      allotTableLoading: false,
      // 库存明细数据
      detailTableList: [],
      detailTableTotal: 0,
      detailTableQueryParams: {
        pageNum: 1,
        pageSize: 6,
        relateType: 0,
        workStatus: 0,
        itemCodeOrName: "",
        warehouseId: "",
      },

      // 已分配的库存明细数据
      allotList: [],
      allotListTotal: 0,
      allotListQueryParams: {
        pageNum: 1,
        pageSize: 6,
        itemCodeOrName: "",
      },

      sourceStorageKey: Math.random(),
      targetStorageKey: Math.random(),
      // 存储单元树
      storageUnitOptions: [],
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 已分配的库存明细数据
      allotIds: [],
      // 非单个禁用
      allotSingle: true,
      // 非多个禁用
      allotMultiple: true,
      warehouseList: [],
      // 目标位置
      targetLocationId: "",
      // 目标仓库
      targetWarehouseId: "",
      deliveryType: "",
      receiveType: "",
      form: {
        deliveryType: "",
        receiveType: "",
        itemStorageDetailList: [],
        occTime: "",
      },
      rules: {
        deliveryType: [
          { required: true, message: "请选择出库收发类别", trigger: "blur" },
        ],
        receiveType: [
          { required: true, message: "请选择入库收发类别", trigger: "blur" },
        ],
        occTime: [
          { required: true, message: "请选择发生时间", trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  methods: {
    // 获取列表数据
    start() {
      this.openVisible = true;
      this.loading = true;
      this.getWarehouseList();
      // this.getStorageUnitTree();
    },

    /** 查询库存货品列表 */
    getItemStorageDetailList() {
      this.detailTableLoading = true;
      listItemStorageDetailByUser(this.detailTableQueryParams).then(
        (response) => {
          this.detailTableList = response.rows;
          this.detailTableTotal = response.total;
          this.detailTableList.forEach((item) => {
            item.allotQuantity = item.quantity;
            // 判断右边分配列表
            if (this.allotList.length > 0) {
              this.allotList.forEach((allotData) => {
                if (allotData.id == item.id) {
                  item.quantity = item.quantity - allotData.allotQuantity;
                  item.allotQuantity = item.quantity;
                }
              });
            }
          });
          this.detailTableLoading = false;
        }
      );
    },
    changeSourceWarehouse() {
      this.getItemStorageDetailList();
      this.allotData = [];
      this.allotList = [];
      this.refreshTargetTable();
    },

    /** 查询存储单元树结构 */
    getStorageUnitTree() {
      this.treeLoading = true;
      treeStorageUnit({
        isSmallestStorageUnit: 1,
        warehouseId: this.targetWarehouseId,
      }).then((response) => {
        this.storageUnitOptions = [];
        if (response.data) {
          this.storageUnitOptions = response.data;
          // 处理树结构
          this.handleTreeData(this.storageUnitOptions);
        }
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

    /** 获取仓库下拉框数据 */
    getWarehouseList() {
      getWarehouseList().then((response) => {
        this.warehouseList = response.data;
        // 默认选中第一个仓库
        this.detailTableQueryParams.warehouseId = this.warehouseList[0].id;
        this.getItemStorageDetailList();
      });
    },

    /** 重置 */
    reset() {
      this.allotData = [];
      this.allotList = [];
      this.storageUnitOptions = [];
      this.targetLocationId = "";
      this.targetWarehouseId = "";
      this.deliveryType = "";
      this.receiveType = "";
      this.detailTableQueryParams = {
        pageNum: 1,
        pageSize: 6,
        relateType: 0,
        workStatus: 0,
        itemCodeOrName: "",
        warehouseId: "",
      };
      this.allotListQueryParams = {
        pageNum: 1,
        pageSize: 6,
        itemCodeOrName: "",
      };
      this.detailTableList = [];
    },

    // 取消按钮
    cancel() {
      this.reset();
      this.openVisible = false;
    },
    // 确定按钮
    submit() {
      if (this.allotList.length !== 0) {
        this.form.itemStorageDetailList = this.allotList;
        this.innerVisible = true;
      } else {
        this.$message({
          type: "error",
          message: "请先分配库存!",
        });
        return;
      }
      // this.reset();
      // this.openVisible = false;
    },

    // 确认信息提交按钮
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.innerVisible = false;
          this.$modal.loading("正在提交...");
          transferItemStorageDetail(this.form)
            .then((response) => {
              this.$modal.closeLoading();
              this.$message({
                type: "success",
                message: "移库成功!",
              });
              this.reset();
              this.resetForm();
              this.openVisible = false;
            })
            .catch(() => {
              this.$modal.closeLoading();
            });
        } else {
          return false;
        }
      });
    },
    cancelSubmit() {
      this.resetForm();
      this.innerVisible = false;
    },

    resetForm() {
      this.$refs["form"].resetFields();
    },
    // 分配按钮
    handleAllot(row) {
      if (this.checkAllot(row)) {
        this.allotQuantity(row);
        this.setWarehouse();
        this.refreshSourceTable();
      }
    },

    // 批量分配按钮
    handleAllotBatch() {
      if (this.ids.length == 0) {
        this.$message({
          type: "error",
          message: "请先选择要分配的数据!",
        });
        return;
      }

      try {
        this.detailTableList.forEach((item) => {
          if (this.ids.includes(item.id)) {
            if (!this.checkAllot(item)) {
              throw new Error("分配校验失败!");
            }
            this.allotQuantity(item);
          }
        });
      } catch (error) {}

      this.setWarehouse();
      this.refreshSourceTable();
    },

    /** 分配校验 */
    checkAllot(rowData) {
      if (this.targetWarehouseId == "") {
        this.$message({
          type: "error",
          message: "请选择目标仓库!",
        });
        return false;
      }
      if (this.targetWarehouseId == this.detailTableQueryParams.warehouseId) {
        this.$message({
          type: "error",
          message: "目标仓库不能与原仓库相同!",
        });
        return false;
      }

      if (rowData.allotQuantity == null || rowData.allotQuantity == 0) {
        this.$message({
          type: "error",
          message: "请先分配数量!",
        });
        return false;
      }
      if (rowData.quantity < rowData.allotQuantity) {
        this.$message({
          type: "error",
          message: "分配数量不能大于库存数量!",
        });
        return false;
      }
      return true;
    },

    // 分配数量
    allotQuantity(rowData) {
      if (this.allotList.length > 0) {
        let allotData = this.allotList.find((item) => item.id == rowData.id);
        if (allotData) {
          allotData.allotQuantity =
            Number(allotData.allotQuantity) + Number(rowData.allotQuantity);
        } else {
          this.allotList.push(JSON.parse(JSON.stringify(rowData)));
        }
      } else {
        this.allotList.push(JSON.parse(JSON.stringify(rowData)));
      }
      rowData.quantity = rowData.quantity - rowData.allotQuantity;
      rowData.allotQuantity = rowData.quantity;
    },

    // 取消全部按钮
    handleCancelAll() {
      if (this.allotIds.length == 0) {
        this.$message({
          type: "error",
          message: "请先选择要取消分配的数据!",
        });
        return;
      }

      this.allotList.forEach((item) => {
        if (this.allotIds.includes(item.id)) {
          this.detailTableList.forEach((detailItem) => {
            if (detailItem.id == item.id) {
              detailItem.quantity = add(
                detailItem.quantity + item.allotQuantity
              );
              detailItem.allotQuantity = detailItem.quantity;
            }
          });
        }
      });
      this.allotList = this.allotList.filter(
        (item) => !this.allotIds.includes(item.id)
      );

      this.refreshTargetTable();
    },

    // 取消
    handleCancel(row) {
      this.detailTableList.forEach((item) => {
        if (item.id == row.id) {
          item.quantity = add(item.quantity + row.allotQuantity);
          item.allotQuantity = item.quantity;
        }
      });
      this.allotList = this.allotList.filter((item) => item.id != row.id);
      this.refreshTargetTable();
    },

    refreshSourceTable() {
      this.sourceStorageKey = Math.random();
    },
    refreshTargetTable() {
      this.targetStorageKey = Math.random();
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    // 多选框选中数据
    handleSelectionChangeAllot(selection) {
      this.allotIds = selection.map((item) => item.id);
      this.allotSingle = selection.length !== 1;
      this.allotMultiple = !selection.length;
    },

    getAllotList() {},

    // 批量分配库位
    handleChangeLocation() {
      if (this.allotList.length > 0) {
        this.$nextTick(() => {
          this.setLocation();
          this.refreshTargetTable();
        });
      }
    },

    // 分配库位
    setWarehouse() {
      this.allotList.forEach((item) => {
        var warehouseName = this.warehouseList.find(
          (item) => item.id == this.targetWarehouseId
        ).name;
        item.targetWarehouseName = warehouseName;
        item.targetWarehouseId = this.targetWarehouseId;
      });
    },
    setLocation() {
      var node = this.$refs["loactionSelect"].getCheckedNodes()[0];
      this.allotList.forEach((item) => {
        if (this.allotIds.includes(item.id)) {
          item.targetLocationName = node.label;
          item.targetLocationId = node.value;
        }
      });
    },

    // 右边仓库下拉框修改
    handleChangeWarehouse() {
      this.getStorageUnitTree();
      if (this.targetWarehouseId == this.detailTableQueryParams.warehouseId) {
        this.$message({
          type: "error",
          message: "目标仓库不能与原仓库相同!",
        });
        this.$nextTick(() => {
          this.targetWarehouseId = "";
          this.targetLocationId = "";
        });
        return;
      }
      var warehouseName = this.warehouseList.find(
        (item) => item.id == this.targetWarehouseId
      ).name;

      if (this.allotList.length > 0) {
        this.allotList.forEach((item) => {
          item.targetWarehouseName = warehouseName;
          item.targetWarehouseId = this.targetWarehouseId;
          item.targetLocationId = "";
          item.targetLocationName = "";
        });
      }
      this.refreshTargetTable();
    },
    // 重置查询条件
    resetQuery() {
      this.detailTableQueryParams.itemCodeOrName = "";
      this.getItemStorageDetailList();
    },
  },
};
</script>

<style></style>
