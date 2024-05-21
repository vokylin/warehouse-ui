<template>
  <div class="app-container">
    <el-dialog
      title="退货分配"
      :visible.sync="openVisible"
      width="90%"
      append-to-body
      :loading="loading"
      class="abow_dialog"
    >
      <el-descriptions
        title="作业信息"
        v-if="this.isShowNotice"
        size="mini"
        border
      >
        <el-descriptions-item label="退货作业编号">{{
          workNoticeData.id
        }}</el-descriptions-item>
        <el-descriptions-item label="质检通知单号">{{
          workNoticeData.noticeId
        }}</el-descriptions-item>
        <el-descriptions-item label="收发类型">
          <dict-tag
            :options="dict.type.receive_type"
            :value="workNoticeData.receiveSendType"
          />
        </el-descriptions-item>
      </el-descriptions>

      <el-row :gutter="10" class="mb8" style="margin-top: 10px">
        <el-col :span="1.5">
          <el-input
            size="mini"
            placeholder="请输入货品编码/名称"
            v-model="detailTableQueryParams.itemCodeOrName"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getWorkNoticeDetailList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="1.5">
          <el-cascader
            size="mini"
            v-model="locationId"
            placeholder="批量分配库位"
            ref="loactionSelectAll"
            :options="storageUnitOptions"
            :show-all-levels="false"
            :props="{
              value: 'id',
              emitPath: false,
            }"
            style="width: 90%"
            @change="handleChangeAll()"
          ></el-cascader>
        </el-col>
      </el-row>

      <el-card class="box-card" body-style="padding='5px'">
        <div slot="header" class="clearfix">
          <span>通知明细</span>
        </div>
        <el-table
          v-loading="detailTableLoading"
          :data="workNoticeDetailList"
          @selection-change="handleSelectionChange"
          :key="randomKey"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
            :selectable="canSelect"
          />
          <el-table-column
            label="物料编码"
            align="center"
            width="180"
            prop="itemCode"
          />
          <el-table-column
            label="物料名称"
            align="center"
            width="180"
            prop="itemName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="物料批次"
            align="center"
            width="180"
            prop="batchNo"
          />

          <el-table-column
            label="来源仓库"
            align="center"
            prop="sourceWarehouseName"
            width="140"
          />
          <el-table-column
            label="来源货位"
            align="center"
            prop="sourceLocationName"
            width="140"
          >
          </el-table-column>
          <el-table-column label="通知数量" align="center" prop="quantity" />
          <el-table-column
            label="已分配数量"
            align="center"
            prop="allotQuantity"
            width="120"
          />
          <el-table-column
            label="单位"
            align="center"
            prop="unit"
            width="120"
          />
          <el-table-column
            label="待分配数量"
            align="center"
            fixed="right"
            prop="currentAllocatedQuantity"
            width="120"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.currentAllocatedQuantity"
                size="mini"
                v-if="scope.row.quantity > scope.row.allotQuantity"
              ></el-input>
              <span v-else>{{ scope.row.currentAllocatedQuantity }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="目标库位"
            fixed="right"
            width="180"
            align="center"
            prop="locationId"
          >
            <template slot-scope="scope">
              <el-cascader
                size="mini"
                :options="storageUnitOptions"
                :show-all-levels="false"
                :props="{
                  value: 'id',
                  emitPath: false,
                }"
                v-model="scope.row.locationId"
                v-if="scope.row.quantity > scope.row.allotQuantity"
              ></el-cascader>
              <span v-else>{{ scope.row.locationName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right" width="80">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-finished"
                @click="handleAllot(scope.row)"
                v-if="scope.row.quantity > scope.row.allotQuantity"
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
          @pagination="getWorkNoticeDetailList"
        />
      </el-card>
      <el-card class="box-card" body-style="padding='5px'">
        <div slot="header" class="clearfix">
          <span>分配详情</span>
        </div>
        <el-table
          v-loading="loading"
          :data="workNoticeAllotList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
            :selectable="canSelectAllotDetail"
          />
          <el-table-column
            label="物料编码"
            align="center"
            width="180"
            prop="itemCode"
          />
          <el-table-column
            label="物料名称"
            align="center"
            width="180"
            prop="itemName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="批次"
            width="180"
            align="center"
            prop="batchNo"
          />
          <el-table-column
            label="来源仓库"
            align="center"
            prop="sourceWarehouseName"
            width="140"
          />
          <el-table-column
            label="来源货位"
            align="center"
            prop="sourceLocationName"
            width="140"
          >
          </el-table-column>
          <el-table-column
            label="目标仓库"
            align="center"
            prop="warehouseName"
            width="140"
          />
          <el-table-column
            label="目标货位"
            align="center"
            prop="targetLocationName"
            width="140"
          >
          </el-table-column>
          <el-table-column label="分配数量" align="center" prop="quantity" />
          <el-table-column label="作业状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag
                :options="dict.type.refund_work_status"
                :value="scope.row.status"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="160"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-finished"
                @click="handleRefundConfirm(scope.row)"
                v-if="scope.row.status === 0"
                >退货确认</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-close"
                v-if="scope.row.status === 0"
                @click="handleCancel(scope.row)"
                >取消</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <pagination
          small
          layout="total,prev, pager, next"
          v-show="workNoticeAllotTableTotal > 0"
          :total="workNoticeAllotTableTotal"
          :page.sync="workNoticeAllotTableQueryParams.pageNum"
          :limit.sync="workNoticeAllotTableQueryParams.pageSize"
          @pagination="getWorkNoticeAllotList"
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
  listWorkNoticeDetail,
  allot,
  cancelAllot,
  submitAllot,
} from "@/api/warehouse/workNoticeDetail";
import {
  listWorkNoticeAllot,
  refundConfirm,
} from "@/api/warehouse/workNoticeAllot";

import { treeStorageUnit } from "@/api/system/storageUnit";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  dicts: ["work_status", "refund_work_status", "receive_type"],
  name: "work",
  components: {
    Treeselect,
  },
  props: {},
  data() {
    return {
      // 是否显示隐藏搜索
      showSearch: false,
      // 弹窗是否显示
      openVisible: false,
      // 加载状态
      loading: false,
      detailTableLoading: false,
      itemDetailTableLoading: false,
      // 收货通知数据
      workNoticeData: {},
      // 通知详情数据
      workNoticeDetailList: [],
      detailTableTotal: 0,
      detailTableQueryParams: {
        pageNum: 1,
        pageSize: 10,
        workNoticeId: "",
        itemCodeOrName: "",
      },
      // 收货通知详情数据
      workNoticeAllotList: [],
      workNoticeAllotTableTotal: 0,
      workNoticeAllotTableQueryParams: {
        pageNum: 1,
        pageSize: 10,
        workNoticeId: "",
      },
      // 是否显示通知信息
      isShowNotice: true,
      randomKey: Math.random(),
      // 存储单元树
      storageUnitOptions: [],
      storageUnitList: [],
      // 存储位置
      locationId: "",
      ids: [],
      // 分配列表选中数据
      allotListSelection: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
    };
  },
  created() {},
  methods: {
    // 获取列表数据
    start(rowData) {
      this.loading = true;
      this.workNoticeData = rowData;
      this.getWorkNoticeDetailList();
      this.getWorkNoticeAllotList();
      this.getStorageUnitTree();
      this.openVisible = true;
      this.loading = false;
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
        this.storageUnitList.push(item);
        if (item.children) {
          this.handleTreeData(item.children);
        } else {
          item.disabled = item.isSmallestStorageUnit == 1 ? false : true;
        }
      });
    },

    /** 查询上架作业详情列表 */
    getWorkNoticeDetailList() {
      this.detailTableLoading = true;
      this.detailTableQueryParams.workNoticeId = this.workNoticeData.id;
      listWorkNoticeDetail(this.detailTableQueryParams).then((response) => {
        this.workNoticeDetailList = response.rows;
        this.detailTableTotal = response.total;
        this.workNoticeDetailList.forEach((item) => {
          item.currentAllocatedQuantity = item.quantity - item.allotQuantity;
        });
        this.detailTableLoading = false;
      });
    },

    /**查询上架作业分配列表 */
    getWorkNoticeAllotList() {
      this.itemDetailTableLoading = true;
      this.workNoticeAllotTableQueryParams.workNoticeId =
        this.workNoticeData.id;
      listWorkNoticeAllot(this.workNoticeAllotTableQueryParams).then(
        (response) => {
          this.workNoticeAllotList = response.rows;
          this.workNoticeAllotTableTotal = response.total;
          this.itemDetailTableLoading = false;
        }
      );
    },
    // 是否禁用选择
    canSelect(row) {
      return !row.quantity === row.allotQuantity;
    },
    canSelectAllotDetail(row) {
      return row.workStatus === 0;
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

    // 分配按钮
    handleAllot(rowData) {
      if (rowData.currentAllocatedQuantity > rowData.quantity) {
        this.$message({
          type: "error",
          message: "分配数量不能大于通知数量!",
        });
        return false;
      }
      if (rowData.currentAllocatedQuantity <= 0) {
        this.$message({
          type: "error",
          message: "分配数量不能小于等于0!",
        });
        return false;
      }
      if (
        rowData.quantity <
        Number(rowData.allotQuantity) + Number(rowData.currentAllocatedQuantity)
      ) {
        this.$message({
          type: "error",
          message: "分配数量与已分配数量之和不能大于通知数量!",
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
      this.$confirm("确认分配吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          allot(rowData).then((response) => {
            this.$message({
              type: "success",
              message: "分配成功!",
            });
            this.getWorkNoticeDetailList();
            this.getWorkNoticeAllotList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消分配",
          });
        });
    },

    // 取消按钮
    handleCancel(row) {
      this.$confirm("确认取消分配吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          cancelAllot(row.id).then((response) => {
            this.$message({
              type: "success",
              message: "取消分配成功!",
            });
            this.getWorkNoticeDetailList();
            this.getWorkNoticeAllotList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
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
    handleSelectionChange(selection) {
      this.allotListSelection = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    // 批量分配库位
    handleChangeAll() {
      if (this.ids == null || this.ids.length == 0) {
        this.$message({
          type: "error",
          message: "请先选择需要分配的物料!",
        });
        return;
      }
      this.$nextTick(() => {
        var node = this.$refs["loactionSelectAll"].getCheckedNodes()[0];
        var locationName = node.label;
        var locationId = node.id;

        this.workNoticeDetailList.forEach((item) => {
          if (this.ids.indexOf(item.id) !== -1) {
            item.locationName = locationName;
            item.locationId = locationId;
          }
        });
        this.refreshTable();
      });
    },
    // 退货确认
    handleRefundConfirm(row) {
      this.$confirm("确认退货吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          refundConfirm(row.id).then((response) => {
            this.$message({
              type: "success",
              message: "退货成功!",
            });
            this.getWorkNoticeDetailList();
            this.getWorkNoticeAllotList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退货",
          });
        });
    },

    // 批量分配入库
    handleAllotAll() {
      if (
        this.allotListSelection == null ||
        this.allotListSelection.length == 0
      ) {
        this.$message({
          type: "error",
          message: "请先选择需要分配的物料!",
        });
        return;
      }

      this.$confirm("确认分配吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          submitAllot(this.allotListSelection).then((response) => {
            this.$message({
              type: "success",
              message: "分配成功!",
            });
            this.getWorkNoticeDetailList();
            this.getWorkNoticeAllotList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消分配",
          });
        });
    },

    // 批量取消分配
    handleCancelAll() {
      if (
        this.allotListSelection == null ||
        this.allotListSelection.length == 0
      ) {
        this.$message({
          type: "error",
          message: "请先选择需要取消分配的物料!",
        });
        return;
      }

      this.$confirm("确认取消分配吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          cancelAllotAll(this.allotListSelection).then((response) => {
            this.$message({
              type: "success",
              message: "取消分配成功!",
            });
            this.getWorkNoticeDetailList();
            this.getWorkNoticeAllotList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
  },
};
</script>
