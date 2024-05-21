<template>
  <div class="app-container">
    <el-dialog
      title="入库通知收货"
      :visible.sync="openVisible"
      width="100%"
      append-to-body
      :loading="loading"
    >
      <el-descriptions
        title="通知信息"
        :column="4"
        v-if="this.isShowNotice"
        size="mini"
        border
      >
        <el-descriptions-item label="业务系统单号">{{
          receiveNoticeData.businessId
        }}</el-descriptions-item>
        <el-descriptions-item label="单据类型">
          <dict-tag
            :options="dict.type.business_type_receive"
            :value="receiveNoticeData.businessType"
          />
        </el-descriptions-item>
        <el-descriptions-item label="通知状态">
          <dict-tag
            :options="dict.type.recive_notice_status"
            :value="receiveNoticeData.status"
          />
        </el-descriptions-item>
        <el-descriptions-item label="单据说明">{{
          receiveNoticeData.noticeDesc
        }}</el-descriptions-item>
      </el-descriptions>

      <el-row :gutter="10" class="mb8" style="margin-top: 10px">
        <el-col :span="1.5">
          <el-button size="mini" plain @click="handleDetail"
            >查看通知信息</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-input
            placeholder="请输入物料编码/名称"
            v-model="detailTableQueryParams.itemCodeOrName"
            class="input-with-select"
            size="mini"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              size="mini"
              @click="getReceiveNoticeDetailList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="1.5">
          <el-cascader
            v-model="locationId"
            placeholder="批量分配库位"
            ref="loactionSelectAll"
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

      <el-card class="box-card" body-style="padding='5px'">
        <div slot="header" class="clearfix">
          <span>通知明细</span>
        </div>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              size="mini"
              type="primary"
              plain
              :disabled="batchReceiptDisabled"
              @click="handleBatchReceipt()"
              >批量收货</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              size="mini"
              type="primary"
              plain
              :disabled="batchAllotDisabled"
              @click="handleBatchAllot()"
              >批量分配</el-button
            >
          </el-col>
        </el-row>

        <el-table
          v-loading="detailTableLoading"
          :data="detailTableList"
          :key="randomKey"
          @selection-change="handleSelectionChange"
          :default-sort="defaultSort"
          @sort-change="handleSortChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
            :selectable="canSelect"
          />
          <el-table-column
            label="物料编码"
            width="180"
            align="center"
            prop="itemCode"
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
          />
          <el-table-column
            label="物料名称"
            width="240"
            align="center"
            prop="itemName"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag
                :options="dict.type.receipt_status"
                :value="scope.row.status"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="物料类型"
            align="center"
            width="120"
            prop="itemType"
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
          >
            <template slot-scope="scope">
              <dict-tag
                :options="dict.type.item_type"
                :value="scope.row.itemType"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="业务数量"
            align="center"
            width="120"
            prop="businessQuantity"
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
          >
            <template slot-scope="scope">
              <span
                >{{ scope.row.businessQuantity }}
                {{ scope.row.businesUnit }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            label="换算率"
            align="center"
            prop="conversionRate"
          />
          <el-table-column
            label="通知数量"
            align="center"
            prop="quantity"
            width="120"
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.quantity }} {{ scope.row.unit }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="已收数量"
            align="center"
            prop="receiveQuantity"
            width="120"
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.receiveQuantity }} {{ scope.row.unit }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="规格型号"
            align="center"
            width="120"
            prop="spec"
          />
          <!-- <el-table-column label="物料税率" align="center" prop="tax" /> -->
          <el-table-column
            label="物料批次"
            width="120"
            align="center"
            prop="batchNo"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.batchNo"
                size="mini"
                v-if="
                  scope.row.quantity > scope.row.receiveQuantity &&
                  scope.row.itemType != 0
                "
              />
              <span v-else>{{ scope.row.batchNo }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="生产日期"
            align="center"
            fixed="right"
            prop="productDate"
            width="180"
          >
            <template slot-scope="scope">
              <el-date-picker
                v-model="scope.row.productDate"
                type="date"
                size="mini"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width: 80%"
                v-if="
                  scope.row.quantity > scope.row.receiveQuantity &&
                  scope.row.itemType != 0
                "
              ></el-date-picker>
              <span v-else>{{ scope.row.productDate }}</span>
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
                v-if="
                  scope.row.quantity > scope.row.receiveQuantity &&
                  scope.row.itemType != 0
                "
              ></el-input>
              <span v-else>{{ scope.row.allotQuantity }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="待检位置"
            fixed="right"
            width="180"
            align="center"
            prop="locationId"
          >
            <template slot-scope="scope">
              <el-cascader
                size="mini"
                v-model="scope.row.locationId"
                :options="storageUnitOptions"
                :show-all-levels="false"
                :props="{
                  value: 'id',
                  emitPath: false,
                }"
                ref="locationSelect"
                v-if="scope.row.quantity > scope.row.receiveQuantity"
              ></el-cascader>
              <span v-else>{{ scope.row.locationName }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" fixed="right" width="80">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-check"
                v-if="
                  scope.row.itemType === 0 && scope.row.receiveQuantity == 0
                "
                @click="handleReceipt(scope.row)"
                >收货</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-finished"
                @click="handleAllot(scope.row)"
                v-if="
                  scope.row.itemType != 0 &&
                  scope.row.quantity > scope.row.receiveQuantity
                "
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
          @pagination="getReceiveNoticeDetailList"
        />
      </el-card>
      <el-card class="box-card" body-style="padding='5px'">
        <div slot="header" class="clearfix">
          <span>分配详情</span>
        </div>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="danger" plain size="mini" @click="handleCancelAll"
              >取消全部</el-button
            >
          </el-col>
        </el-row>
        <el-table
          v-loading="itemDetailTableLoading"
          :data="itemDetailTableList"
        >
          <el-table-column
            label="物料编码"
            width="180"
            align="center"
            prop="itemCode"
          />
          <el-table-column
            label="物料名称"
            width="240"
            align="center"
            prop="itemName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="批次"
            align="center"
            width="140"
            prop="batchNo"
          />
          <el-table-column label="单位" align="center" prop="unit" />
          <el-table-column label="分配数量" align="center" prop="quantity" />
          <el-table-column
            label="合格数量"
            align="center"
            prop="passQuantity"
          />
          <el-table-column
            label="不合格数量"
            align="center"
            prop="failQuantity"
            width="140"
          />
          <el-table-column label="质检状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag
                :options="dict.type.recive_item_status"
                :value="scope.row.status"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="质检留样数量"
            align="center"
            width="120"
            prop="keepQuantity"
          />
          <el-table-column
            label="质检抽样数量"
            align="center"
            width="120"
            prop="sampleQuantity"
          />
          <el-table-column
            label="退货数量"
            align="center"
            width="120"
            prop="refundQuantity"
          />
          <el-table-column
            label="生产日期"
            align="center"
            prop="productDate"
            width="160"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.productDate, "{y}-{m}-{d}") }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="物料单价" align="center" prop="price" /> -->
          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="240"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-check"
                v-if="scope.row.status === 0 && scope.row.workStatus === 0"
                @click="handleQualityCheck(scope.row)"
                >质检作业</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-upload2"
                v-if="scope.row.status === 2 && scope.row.workStatus !== 2"
                @click="handleShelves(scope.row)"
                >上架作业</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-upload2"
                v-if="
                  scope.row.status === 3 &&
                  scope.row.workStatus !== 2 &&
                  scope.row.failQuantity > 0
                "
                @click="handleShelves(scope.row)"
                >上架作业</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-close"
                v-if="scope.row.workStatus === 0"
                @click="handleCancel(scope.row)"
                >取消</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <pagination
          small
          layout="total,prev, pager, next"
          v-show="itemDetailTableTotal > 0"
          :total="itemDetailTableTotal"
          :page.sync="itemDetailTableQueryParams.pageNum"
          :limit.sync="itemDetailTableQueryParams.pageSize"
          @pagination="getReceiveItemDetailList"
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
  listWmsReceiveNoticeDetail,
  returnItem,
  receipt,
  batchReceipt,
  allot,
  batchAllot,
  getWmsReceiveNoticeDetail,
} from "@/api/warehouse/receiveNoticeDetail";
import {
  listWmsReceiveItemDetail,
  qualityCheck,
  shelves,
  cancel,
  cancelAll,
} from "@/api/warehouse/receiveItemDetail";

import { treeStorageUnit } from "@/api/system/storageUnit";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "receipt",
  dicts: [
    "receipt_status",
    "recive_item_status",
    "item_type",
    "receive_item_detail_work_status",
    "recive_notice_status",
    "receive_type",
    "belongs_type",
    "business_type_receive",
  ],
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
      itemDetailTableLoading: false,
      // 收货通知数据
      receiveNoticeData: {},
      // 通知详情数据
      detailTableList: [],
      detailTableTotal: 0,
      detailTableQueryParams: {
        pageNum: 1,
        pageSize: 10,
        receiveNoticeId: "",
        itemCodeOrName: "",
        orderByColumn: "itemType",
        isAsc: "ascending",
      },
      // 收货通知详情数据
      itemDetailTableList: [],
      itemDetailTableTotal: 0,
      itemDetailTableQueryParams: {
        pageNum: 1,
        pageSize: 10,
        receiveNoticeId: "",
      },
      // 是否显示通知信息
      isShowNotice: false,
      randomKey: Math.random(),
      // 存储单元树
      storageUnitOptions: [],
      // 存储位置
      locationId: "",
      ids: [],
      selectionRows: [],
      // 默认排序
      defaultSort: { prop: "itemType", order: "descending" },
      // 临时分配库位集合
      tempDetailList: [],
      // 批量分配禁用
      batchAllotDisabled: true,
      // 批量收货禁用
      batchReceiptDisabled: true,
    };
  },
  created() {},
  methods: {
    // 获取列表数据
    start(rowData) {
      this.openVisible = true;
      this.loading = true;
      this.receiveNoticeData = rowData;
      this.getReceiveNoticeDetailList();
      this.getReceiveItemDetailList();
      this.getStorageUnitTree();
    },

    /** 查询存储单元树结构 */
    getStorageUnitTree() {
      this.treeLoading = true;
      treeStorageUnit({ isSmallestStorageUnit: 1 }).then((response) => {
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

    /** 查询入库通知物料列表 */
    getReceiveNoticeDetailList() {
      this.detailTableLoading = true;
      this.detailTableQueryParams.receiveNoticeId = this.receiveNoticeData.id;
      listWmsReceiveNoticeDetail(this.detailTableQueryParams).then(
        (response) => {
          this.detailTableList = response.rows;
          this.detailTableTotal = response.total;
          this.detailTableLoading = false;
        }
      );
    },
    updateNoticeDetailRow(row) {
      this.detailTableLoading = true;
      getWmsReceiveNoticeDetail(row.id).then((response) => {
        this.$nextTick(() => {
          var data = response.data;
          this.detailTableList.forEach((item) => {
            if (item.id == data.id) {
              item.batchNo = data.batchNo;
              item.quantity = data.quantity;
              item.receiveQuantity = data.receiveQuantity;
              item.receiptStatus = data.receiptStatus;
              item.locationId = data.locationId;
              item.productDate = data.productDate;
              item.allotQuantity = data.allotQuantity;
            }
          });
          this.refreshTable();
        });
        this.detailTableLoading = false;
      });
    },
    /**查询入库通知货物详情列表 */
    getReceiveItemDetailList() {
      this.itemDetailTableLoading = true;
      this.itemDetailTableQueryParams.receiveNoticeId =
        this.receiveNoticeData.id;
      listWmsReceiveItemDetail(this.itemDetailTableQueryParams).then(
        (response) => {
          this.itemDetailTableList = response.rows;
          this.itemDetailTableTotal = response.total;
          this.itemDetailTableLoading = false;
        }
      );
    },

    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.detailTableQueryParams.orderByColumn = column.prop;
      this.detailTableQueryParams.isAsc = column.order;
      this.getReceiveNoticeDetailList();
    },

    // 是否禁用选择
    canSelect(row) {
      return !(row.quantity === row.receiveQuantity);
    },

    // 取消按钮
    cancel() {
      this.openVisible = false;
      this.$emit("refreshTable");
    },
    // 确定按钮
    submit() {
      this.openVisible = false;
      this.$emit("refreshTable");
    },
    // 查看通知信息按钮
    handleDetail() {
      this.isShowNotice = !this.isShowNotice;
    },
    // 收货按钮
    handleReceipt(row) {
      if (this.checkAllot(row)) {
        if (row.quantity != row.allotQuantity) {
          this.$message({
            type: "error",
            message: "进料验收不能拆分数量!",
          });
          return;
        }
        receipt(row).then((response) => {
          this.$message({
            type: "success",
            message: "收货成功!",
          });
          this.updateNoticeDetailRow(row);
          this.getReceiveItemDetailList();
        });
      }
    },

    // 批量收货按钮
    handleBatchReceipt() {
      if (this.selectionRows == null || this.selectionRows.length == 0) {
        this.$message({
          type: "error",
          message: "请选择需要收货的数据!",
        });
        return;
      }
      try {
        this.selectionRows.forEach((item) => {
          if (item.quantity != item.allotQuantity) {
            this.$message({
              type: "error",
              message: "进料验收不能拆分数量!",
            });
            throw new Error("进料验收不能拆分数量!");
          }
          if (item.locationId == null || item.locationId == "") {
            this.$message({
              type: "error",
              message: "请选择待检位置!",
            });
            throw new Error("请选择待检位置!");
          }
        });
      } catch (e) {
        return;
      }

      batchReceipt(this.selectionRows).then((response) => {
        this.$message({
          type: "success",
          message: "批量收货成功!",
        });
        this.getReceiveNoticeDetailList();
        this.getReceiveItemDetailList();
      });
    },

    // 分配按钮
    handleAllot(row) {
      if (this.checkAllot(row)) {
        allot(row).then((response) => {
          this.$message({
            type: "success",
            message: "分配成功!",
          });
          this.updateNoticeDetailRow(row);
          this.getReceiveItemDetailList();
        });
      }
    },

    // 批量分配按钮
    handleBatchAllot() {
      if (this.ids == null || this.ids.length == 0) {
        this.$message({
          type: "error",
          message: "请选择需要分配的数据!",
        });
        return;
      }

      try {
        this.selectionRows.forEach((item) => {
          if (!this.checkAllot(item)) {
            throw new Error("分配校验未通过!");
          }
        });
      } catch (e) {
        return;
      }
      batchAllot(this.selectionRows).then((response) => {
        this.$message({
          type: "success",
          message: "批量分配成功!",
        });
        this.getReceiveNoticeDetailList();
        this.getReceiveItemDetailList();
      });
    },

    // 取消按钮
    handleCancel(row) {
      cancel(row).then((response) => {
        this.$message({
          type: "success",
          message: "取消分配成功!",
        });
        this.getReceiveNoticeDetailList();
        this.getReceiveItemDetailList();
      });
    },

    // 质检按钮
    handleQualityCheck(row) {
      this.$confirm("确认发送质检作业吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          qualityCheck(row).then((response) => {
            this.$message({
              type: "success",
              message: "发送质检作业成功!",
            });
            this.getReceiveNoticeDetailList();
            this.getReceiveItemDetailList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消发送",
          });
        });
    },

    // 上架按钮
    handleShelves(row) {
      shelves(row).then((response) => {
        this.$message({
          type: "success",
          message: "生成上架作业成功!",
        });
        this.getReceiveNoticeDetailList();
        this.getReceiveItemDetailList();
      });
    },

    // 取消全部按钮
    handleCancelAll(row) {
      this.$confirm("确认取消全部分配吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          row.receiveNoticeId = this.receiveNoticeData.id;
          cancelAll(row).then((response) => {
            this.$message({
              type: "success",
              message: "取消分配成功!",
            });
            this.getReceiveNoticeDetailList();
            this.getReceiveItemDetailList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },

    // 退货
    handleReturnItem(row) {
      this.$confirm("确认退货吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          returnItem(row).then((response) => {
            this.$message({
              type: "success",
              message: "退货成功!",
            });
          });
          this.getReceiveNoticeDetailList();
          this.getReceiveItemDetailList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退货",
          });
        });
    },
    refreshTable() {
      this.randomKey = Math.random();
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.selectionRows = selection;
      if (selection.length > 0) {
        this.checkBatchDisabled(selection);
      } else {
        this.batchAllotDisabled = true;
        this.batchReceiptDisabled = true;
      }
    },

    // 检查批量按钮是否禁用
    checkBatchDisabled(selection) {
      selection.forEach((item) => {
        this.batchReceiptDisabled = item.itemType !== 0;
        this.batchAllotDisabled = item.itemType === 0;
      });
      // itemType为0 是进料验收 为1是进货,其他
      let filterList = selection.filter((item) => item.itemType === 0);
      let otherList = selection.filter((item) => item.itemType !== 0);
      if (filterList.length > 0 && otherList.length > 0) {
        this.batchReceiptDisabled = true;
        this.batchAllotDisabled = true;
      }
    },

    // 批量分配库位
    handleChangeAll() {
      if (this.ids == null || this.ids.length == 0) {
        this.$message({
          type: "error",
          message: "请选择需要分配的数据!",
        });
        return;
      }
      this.$nextTick(() => {
        var node = this.$refs["loactionSelectAll"].getCheckedNodes()[0];
        var locationName = node.label;
        var locationId = node.value;
        this.detailTableList.forEach((item) => {
          if (this.ids.includes(item.id)) {
            if (item.receiveQuantity < item.quantity) {
              item.locationName = locationName;
              item.locationId = locationId;
            }
          }
        });
        this.refreshTable();
      });
    },

    // 检查是否可以分配
    checkAllot(rowData) {
      if (rowData.allotQuantity > rowData.quantity) {
        this.$message({
          type: "error",
          message: "分配数量不能大于通知数量!",
        });
        return false;
      }
      if (rowData.allotQuantity <= 0) {
        this.$message({
          type: "error",
          message: "分配数量不能小于等于0!",
        });
        return false;
      }
      if (
        rowData.quantity <
        Number(rowData.receiveQuantity) + Number(rowData.allotQuantity)
      ) {
        this.$message({
          type: "error",
          message: "分配数量与收货数量之和不能大于通知数量!",
        });
        return false;
      }

      if (rowData.locationId == null || rowData.locationId == "") {
        this.$message({
          type: "error",
          message: "请选择库位!",
        });
        return false;
      }
      if (rowData.batchNo == null || rowData.batchNo == "") {
        this.$message({
          type: "error",
          message: "请输入批次号!",
        });
        return false;
      }
      if (rowData.itemType != 3) {
        if (rowData.productDate == null || rowData.productDate == "") {
          this.$message({
            type: "error",
            message: "请选择生产日期!",
          });
          return false;
        }
      }

      return true;
    },
  },
};
</script>
