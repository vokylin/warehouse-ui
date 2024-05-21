<template>
  <div>
    <el-dialog
      title="手动作业"
      :visible.sync="openVisible"
      append-to-body
      :loading="loading"
      width="100%"
      custom-class="center-dialog"
    >
      <el-descriptions
        title="作业信息"
        :column="4"
        v-if="this.isShowNotice"
        size="mini"
        border
      >
        <el-descriptions-item label="上架作业编号">{{
          workNoticeData.id
        }}</el-descriptions-item>
        <el-descriptions-item label="入库通知单号">{{
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
            placeholder="请输入货品编码/名称"
            v-model="detailTableQueryParams.itemCodeOrName"
            class="input-with-select"
            size="mini"
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

      <el-card class="box-card" body-style="padding='5px'">
        <div slot="header" class="clearfix">
          <span>通知明细</span>
        </div>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              size="mini"
              plain
              type="primary"
              @click="handleBatchAllot()"
              >批量分配</el-button
            >
          </el-col>
        </el-row>

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
          />
          <el-table-column
            label="来源货位"
            align="center"
            prop="sourceLocationName"
            width="180"
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
            label="规格"
            align="center"
            prop="spec"
            width="120"
          />
          <!-- <el-table-column
            label="质检扣除数量"
            align="center"
            prop="examineLessNum"
          /> -->
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
                v-if="scope.row.currentAllocatedQuantity > 0"
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
                v-model="scope.row.locationId"
                :options="storageUnitOptions"
                :show-all-levels="false"
                :props="{
                  value: 'id',
                  emitPath: false,
                }"
                v-if="scope.row.currentAllocatedQuantity > 0"
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
                v-if="scope.row.currentAllocatedQuantity > 0"
                @click="handleAllot(scope.row)"
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
          <span>分配明细</span>
        </div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button plain size="mini" type="primary" @click="handleAllotAll"
              >批量入库</el-button
            >
            <el-button plain size="mini" type="danger" @click="handleCancelAll"
              >批量取消</el-button
            >
          </el-col>
        </el-row>

        <el-table
          v-loading="itemDetailTableLoading"
          :data="workNoticeAllotList"
          @selection-change="handleAllotSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
            :selectable="canSelectAllot"
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
            width="120"
            prop="sourceWarehouseName"
          />
          <el-table-column
            label="来源货位"
            align="center"
            width="120"
            prop="sourceLocationName"
          >
          </el-table-column>
          <el-table-column
            label="目标仓库"
            align="center"
            width="120"
            prop="warehouseName"
          />
          <el-table-column
            label="目标货位"
            align="center"
            width="120"
            prop="targetLocationName"
          >
          </el-table-column>
          <el-table-column label="分配数量" align="center" prop="quantity" />
          <el-table-column label="作业状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag
                :options="dict.type.shelf_work_status"
                :value="scope.row.status"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="120"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-finished"
                v-if="scope.row.status === 0"
                @click="handleSubmit(scope.row)"
                >入库</el-button
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
  batchAllot,
  cancelAllot,
  getWorkNoticeDetail,
} from "@/api/warehouse/workNoticeDetail";
import {
  listWorkNoticeAllot,
  submitAllot,
  cancelAll,
} from "@/api/warehouse/workNoticeAllot";

import { treeStorageUnit } from "@/api/system/storageUnit";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  dicts: ["shelf_work_status", "receive_type"],
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
      allotIds: [],
      // 分配列表选中数据
      allotListSelection: [],
      ids: [],
      selection: [],
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

    // 多选框是否禁用
    canSelect(row) {
      return !(row.quantity === row.allotQuantity);
    },

    canSelectAllot(row) {
      return row.status !== 1;
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

    /** 更新行数据 */
    updateNoticeDetailRow(row) {
      this.detailTableLoading = true;
      getWorkNoticeDetail(row.id).then((response) => {
        this.$nextTick(() => {
          var data = response.data;
          this.workNoticeDetailList.forEach((item) => {
            if (item.id == data.id) {
              item.allotQuantity = data.allotQuantity;
              item.currentAllocatedQuantity =
                data.quantity - data.allotQuantity;
              item.locationName = "";
            }
          });
          this.refreshTable();
        });
        this.detailTableLoading = false;
      });
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
    handleAllot(row) {
      if (row.locationId == null || row.locationId == "") {
        this.$message({
          type: "error",
          message: "请先选择目标库位!",
        });
        return;
      }

      if (
        row.currentAllocatedQuantity == null ||
        row.currentAllocatedQuantity == 0
      ) {
        this.$message({
          type: "error",
          message: "请先分配数量!",
        });
        return;
      }

      if (row.quantity < row.currentAllocatedQuantity) {
        this.$message({
          type: "error",
          message: "分配数量不能大于通知数量!",
        });
        return;
      }

      this.$confirm("确认分配吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          allot(row).then((response) => {
            this.$message({
              type: "success",
              message: "分配成功!",
            });
            // this.getWorkNoticeDetailList();
            this.updateNoticeDetailRow(row);
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
    handleAllotSelectionChange(selection) {
      this.allotListSelection = selection.map((item) => item.id);
      this.allotIds = selection.map((item) => item.id);
    },

    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.selection = selection;
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
        var node = this.$refs["loactionSelect"].getCheckedNodes()[0];
        var locationName = node.label;
        var locationId = node.value;
        this.workNoticeDetailList.forEach((item) => {
          if (this.ids.includes(item.id)) {
            if (item.allotQuantity < item.quantity) {
              item.locationName = locationName;
              item.locationId = locationId;
            }
          }
        });
        this.refreshTable();
      });
    },
    // 提交分配
    handleSubmit(row) {
      const requestData = {
        ids: [row.id],
        workNoticeId: this.workNoticeData.id,
      };

      this.$confirm("确认分配吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          submitAllot(requestData).then((response) => {
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

      const requestData = {
        ids: this.allotListSelection,
        workNoticeId: this.workNoticeData.id,
      };

      this.$confirm("是否批量入库？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          submitAllot(requestData).then((response) => {
            this.$message({
              type: "success",
              message: "操作成功!",
            });
            this.getWorkNoticeDetailList();
            this.getWorkNoticeAllotList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消入库",
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
          cancelAll(this.allotListSelection).then((response) => {
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

    // 批量分配
    handleBatchAllot() {
      if (this.selection == null || this.selection.length == 0) {
        this.$message({
          type: "error",
          message: "请先选择需要分配的物料!",
        });
        return;
      }
      try {
        this.selection.forEach((item) => {
          if (!this.checkAllotRule(item)) {
            throw new Error("分配规则校验失败!");
          }
        });
      } catch (e) {
        return;
      }
      let params = this.selection;
      this.$confirm("确认批量分配吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          batchAllot(params).then((response) => {
            this.$message({
              type: "success",
              message: "分配成功!",
            });
            // this.getWorkNoticeDetailList();
            params.forEach((item) => {
              this.updateNoticeDetailRow(item);
            });
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

    checkAllotRule(item) {
      if (item.locationId == null || item.locationId == "") {
        this.$message({
          type: "error",
          message: "请先选择目标库位!",
        });
        return false;
      }

      if (
        item.currentAllocatedQuantity == null ||
        item.currentAllocatedQuantity == 0
      ) {
        this.$message({
          type: "error",
          message: "请先分配数量!",
        });
        return false;
      }

      if (item.quantity < item.currentAllocatedQuantity) {
        this.$message({
          type: "error",
          message: "分配数量不能大于通知数量!",
        });
        return false;
      }
      return true;
    },
  },
};
</script>

<style lang="scss">
.center-dialog {
  top: 50%;
  transform: translateY(-50%);
}
</style>
