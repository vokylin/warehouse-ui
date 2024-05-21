<template>
  <div class="app-container">
    <el-dialog
      title="移位分配"
      :visible.sync="openVisible"
      width="95%"
      append-to-body
      :loading="loading"
    >
      <el-card class="box-card" body-style="padding='5px'">
        <el-row :gutter="10" class="mb8" style="margin-top: 10px">
          <el-col :span="1.5">
            <el-select
              v-model="detailTableQueryParams.warehouseId"
              placeholder="请选择仓库"
              size="mini"
              @change="warehouseChange"
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
          :key="randomKey"
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
            label="物料批号"
            align="center"
            width="140"
            prop="batchNo"
          />
          <el-table-column
            label="物料名称"
            align="center"
            width="240"
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
          <el-table-column label="数量" align="center" prop="quantity" />
          <el-table-column label="单位" align="center" prop="unit" />
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
            label="过期日期"
            align="center"
            prop="expireDate"
            width="180"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.expireDate, "{y}-{m}-{d}") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="分配数量"
            align="center"
            fixed="right"
            prop="allotQuantity"
            width="120"
          >
            <template slot-scope="scope">
              <el-input
                :ref="scope.column.property"
                v-model="scope.row.allotQuantity"
                size="mini"
              ></el-input>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" fixed="right" width="80">
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
        <el-row :gutter="10" class="mb8" style="margin-top: 10px">
          <el-col :span="1.5">
            <el-button type="danger" size="mini" plain @click="handleCancelAll"
              >批量取消</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-cascader
              v-model="locationId"
              placeholder="批量分配库位"
              ref="loactionSelect"
              :options="storageUnitOptions"
              :show-all-levels="false"
              :props="{
                value: 'id',
                emitPath: false,
              }"
              size="mini"
              @change="handleChangeAll()"
            ></el-cascader>
          </el-col>
        </el-row>
        <el-table
          v-loading="allotTableLoading"
          :data="allotList"
          :key="randomKey"
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
            width="140"
            align="center"
            prop="batchNo"
          />
          <el-table-column
            label="物料名称"
            align="center"
            width="240"
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
          <el-table-column label="数量" align="center" prop="allotQuantity" />
          <el-table-column label="单位" align="center" prop="unit" />
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
            label="过期日期"
            align="center"
            prop="expireDate"
            width="180"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.expireDate, "{y}-{m}-{d}") }}</span>
            </template>
          </el-table-column>

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
                :show-all-levels="false"
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
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listItemStorageDetailByUser,
  allotItemStorageDetailBatch,
  moveItemStorageDetail,
} from "@/api/warehouse/itemStorageDetail";
import { treeStorageUnit } from "@/api/system/storageUnit";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getWarehouseList } from "@/api/system/warehouse";
export default {
  name: "displacement",
  dicts: ["storage_status", "work_status", "relate_type"],
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

      randomKey: Math.random(),
      // 存储单元树
      storageUnitOptions: [],
      // 存储位置
      locationId: "",
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
    };
  },
  created() {},
  methods: {
    // 获取列表数据
    start() {
      this.openVisible = true;
      this.loading = true;
      this.getWarehouseList();
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

    /** 查询存储单元树结构 */
    getStorageUnitTree() {
      this.treeLoading = true;
      treeStorageUnit({
        isSmallestStorageUnit: 1,
        warehouseId: this.detailTableQueryParams.warehouseId,
      }).then((response) => {
        this.storageUnitOptions = [];
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

    /** 获取仓库下拉框数据 */
    getWarehouseList() {
      getWarehouseList().then((response) => {
        this.warehouseList = response.data;
        // 默认选中第一个仓库
        this.detailTableQueryParams.warehouseId = this.warehouseList[0].id;
        this.getItemStorageDetailList();
        this.getStorageUnitTree();
      });
    },

    /** 重置 */
    reset() {
      this.allotList = [];
      this.detailTableList = [];
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
      this.allotIds = [];
      this.ids = [];
    },

    // 取消按钮
    cancel() {
      this.reset();
      this.openVisible = false;
    },
    // 确定按钮
    submit() {
      if (this.allotList.length !== 0) {
        moveItemStorageDetail(this.allotList).then((response) => {
          this.reset();
          this.$message({
            type: "success",
            message: "移位成功!",
          });
        });
      }

      this.openVisible = false;
    },
    // 查看通知信息按钮
    handleDetail() {
      this.isShowNotice = !this.isShowNotice;
    },
    // 分配按钮
    handleAllot(row) {
      this.allotQuantity(row);
      this.setLocation();
      this.refreshTable();
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

      this.detailTableList.forEach((detailItemData) => {
        if (this.ids.includes(detailItemData.id)) {
          this.allotQuantity(detailItemData);
        }
      });
      this.setLocation();
      this.refreshTable();
    },

    // 分配数量
    allotQuantity(rowData) {
      if (rowData.allotQuantity == null || rowData.allotQuantity == 0) {
        this.$message({
          type: "error",
          message: "请先分配数量!",
        });
        return;
      }
      if (rowData.quantity < rowData.allotQuantity) {
        this.$message({
          type: "error",
          message: "分配数量不能大于库存数量!",
        });
        return;
      }

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
              detailItem.quantity = detailItem.quantity + item.allotQuantity;
              detailItem.allotQuantity = detailItem.quantity;
            }
          });
        }
      });
      this.allotList = this.allotList.filter(
        (item) => !this.allotIds.includes(item.id)
      );

      this.refreshTable();
    },

    // 取消
    handleCancel(row) {
      this.detailTableList.forEach((item) => {
        if (item.id == row.id) {
          item.quantity = item.quantity + row.allotQuantity;
          item.allotQuantity = item.quantity;
        }
      });
      this.allotList = this.allotList.filter((item) => item.id != row.id);
      this.refreshTable();
    },

    refreshTable() {
      this.randomKey = Math.random();
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
    handleChangeAll() {
      if (this.allotList.length == 0) {
        this.$message({
          type: "error",
          message: "请先分配数据!",
        });
        return;
      }
      this.$nextTick(() => {
        var node = this.$refs.loactionSelect.getCheckedNodes()[0];
        this.allotList.forEach((item) => {
          if (this.allotIds.includes(item.id)) {
            item.targetLocationName = node.label;
            item.targetLocationId = node.value;
          }
        });
        this.refreshTable();
      });
    },

    // 分配库位
    setLocation() {
      if (this.allotList && this.allotList.length > 0) {
        this.allotList.forEach((item) => {
          var node = this.$refs["loactionSelect"].getCheckedNodes()[0];
          if (node == null) {
            return;
          }
          var locationName = node.label;
          var locationId = node.id;
          item.targetLocationName = locationName;
          item.targetLocationId = locationId;
        });
      }
    },

    // 仓库选择
    warehouseChange() {
      this.getItemStorageDetailList();
      this.getStorageUnitTree();
      this.allotList = [];
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
