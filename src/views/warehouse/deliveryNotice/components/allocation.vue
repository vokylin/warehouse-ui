<template>
  <div class="app-container">
    <el-dialog
      title="手动分配"
      :visible.sync="openVisible"
      width="100%"
      append-to-body
      :loading="loading"
    >
      <el-descriptions
        :column="4"
        size="mini"
        border
        style="margin-bottom: 5px"
      >
        <el-descriptions-item label="物料编码">{{
          deliveryNoticeDetailData.itemCode
        }}</el-descriptions-item>
        <el-descriptions-item label="物料名称">{{
          deliveryNoticeDetailData.itemName
        }}</el-descriptions-item>
        <el-descriptions-item label="物料单位">{{
          deliveryNoticeDetailData.itemUnit
        }}</el-descriptions-item>
        <el-descriptions-item label="需求数量">{{
          deliveryNoticeDetailData.quantity
        }}</el-descriptions-item>
        <el-descriptions-item label="待分配数量">{{
          mathSub(deliveryNoticeDetailData.quantity, [
            deliveryNoticeDetailData.workQuantity,
            deliveryNoticeDetailData.allotQuantity,
            deliveryNoticeDetailData.workFinishQuantity,
          ])
        }}</el-descriptions-item>
        <el-descriptions-item label="作业中数量">{{
          deliveryNoticeDetailData.workQuantity
        }}</el-descriptions-item>
        <el-descriptions-item label="完成数量">{{
          deliveryNoticeDetailData.workFinishQuantity
        }}</el-descriptions-item>
      </el-descriptions>
      <el-row>
        <el-col :span="12">
          <el-card class="box-card" body-style="padding='5px'">
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
                    @click="getItemStorageDetailList"
                  ></el-button>
                </el-input>
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="primary"
                  @click="handleAllotBatch"
                  plain
                  size="mini"
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
              <el-table-column
                label="货位"
                align="center"
                prop="locationName"
                width="120"
              />
              <el-table-column
                label="物料批号"
                align="center"
                width="140"
                prop="batchNo"
              />
              <el-table-column
                label="数量"
                align="center"
                width="120"
                prop="quantity"
              />
              <el-table-column
                label="规格"
                align="center"
                width="120"
                prop="spec"
              />

              <el-table-column
                label="库存状态"
                align="center"
                prop="storageStatus"
              >
                <template slot-scope="scope">
                  <dict-tag
                    :options="dict.type.storage_status"
                    :value="scope.row.storageStatus"
                  />
                </template>
              </el-table-column>
              <!-- <el-table-column
                label="关联状态"
                align="center"
                prop="relateType"
              >
                <template slot-scope="scope">
                  <dict-tag
                    :options="dict.type.relate_type"
                    :value="scope.row.relateType"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="作业状态"
                align="center"
                prop="workStatus"
              >
                <template slot-scope="scope">
                  <dict-tag
                    :options="dict.type.work_status"
                    :value="scope.row.workStatus"
                  />
                </template>
              </el-table-column> -->
              <!-- <el-table-column
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
              </el-table-column> -->
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
                width="120"
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
                width="80"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-finished"
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
              @pagination="getItemStorageDetailList"
            />
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card" body-style="padding='5px'">
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
                    @click="getAllotItemStorageDetailList"
                    size="mini"
                  ></el-button>
                </el-input>
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="danger"
                  plain
                  @click="handleCancelAll"
                  size="mini"
                  >批量取消</el-button
                >
              </el-col>
            </el-row>
            <el-table
              v-loading="allotDetailTableLoading"
              :data="allotDetailTableList"
              :key="randomKey"
              @selection-change="handleSelectionChangeAllot"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column
                label="仓库"
                align="center"
                prop="warehouseName"
                width="120"
              />
              <el-table-column
                label="货位"
                align="center"
                prop="locationName"
                width="120"
              />
              <el-table-column
                label="物料批号"
                width="140"
                align="center"
                prop="batchNo"
              />
              <el-table-column label="数量" align="center" prop="quantity" />
              <el-table-column
                label="规格"
                align="center"
                width="120"
                prop="spec"
              />
              <el-table-column
                label="库存状态"
                align="center"
                prop="storageStatus"
              >
                <template slot-scope="scope">
                  <dict-tag
                    :options="dict.type.storage_status"
                    :value="scope.row.storageStatus"
                  />
                </template>
              </el-table-column>
              <!-- <el-table-column
                label="关联状态"
                align="center"
                prop="relateType"
              >
                <template slot-scope="scope">
                  <dict-tag
                    :options="dict.type.relate_type"
                    :value="scope.row.relateType"
                  />
                </template>
              </el-table-column> -->
              <!-- <el-table-column
                label="作业状态"
                align="center"
                prop="workStatus"
              >
                <template slot-scope="scope">
                  <dict-tag
                    :options="dict.type.work_status"
                    :value="scope.row.workStatus"
                  />  
                </template>
              </el-table-column> -->
              <!-- <el-table-column
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
              </el-table-column> -->
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
                label="操作"
                align="center"
                fixed="right"
                width="80"
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
              v-show="allotDetailTableTotal > 0"
              :total="allotDetailTableTotal"
              :page.sync="allotDetailTableQueryParams.pageNum"
              :limit.sync="allotDetailTableQueryParams.pageSize"
              @pagination="getAllotItemStorageDetailList"
            />
          </el-card>
        </el-col>
      </el-row>

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
  allotItemStorageDetail,
  cancelAllotItemStorageDetail,
  allotItemStorageDetailBatch,
  cancelAllotItemStorageDetailBatch,
} from "@/api/warehouse/itemStorageDetail";
import { getDeliveryNoticeDetail } from "@/api/warehouse/deliveryNoticeDetail";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { sub } from "@/utils/math";
export default {
  name: "allocation",
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
      allotDetailTableLoading: false,
      // 收货通知数据
      deliveryNoticeDetailData: {},
      // 库存明细数据
      detailTableList: [],
      detailTableTotal: 0,
      detailTableQueryParams: {
        pageNum: 1,
        pageSize: 10,
        relateType: 0,
        workStatus: 0,
        itemCodeOrName: "",
        itemCode: "",
        storageStatusList: [0, 2],
      },

      // 已分配的库存明细数据
      allotDetailTableList: [],
      allotDetailTableTotal: 0,
      allotDetailTableQueryParams: {
        pageNum: 1,
        pageSize: 10,
        relateType: 3,
        workStatus: 1,
        relateId: "",
        itemCodeOrName: "",
        itemCode: "",
      },

      // 是否显示通知信息
      isShowNotice: false,
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
    };
  },
  created() {},
  methods: {
    // 获取列表数据
    start(rowData) {
      this.openVisible = true;
      this.loading = true;
      this.deliveryNoticeDetailData = rowData;
      this.getItemStorageDetailList();
      this.getAllotItemStorageDetailList();
    },

    /** 查询库存货品列表 */
    getItemStorageDetailList() {
      this.detailTableLoading = true;
      this.detailTableQueryParams.itemCode =
        this.deliveryNoticeDetailData.itemCode;
      listItemStorageDetailByUser(this.detailTableQueryParams).then(
        (response) => {
          this.detailTableList = response.rows;
          this.detailTableTotal = response.total;
          this.detailTableLoading = false;
        }
      );
    },

    /** 查询已分配的库存货品列表 */
    getAllotItemStorageDetailList() {
      this.allotDetailTableLoading = true;
      this.allotDetailTableQueryParams.relateId =
        this.deliveryNoticeDetailData.deliveryNoticeId;
      this.allotDetailTableQueryParams.itemCode =
        this.deliveryNoticeDetailData.itemCode;
      listItemStorageDetailByUser(this.allotDetailTableQueryParams).then(
        (response) => {
          this.allotDetailTableList = response.rows;
          this.allotDetailTableTotal = response.total;
          this.allotDetailTableLoading = false;
        }
      );
    },

    /** 查询通知详情 */
    getDeliveryNoticeDetail() {
      getDeliveryNoticeDetail(this.deliveryNoticeDetailData.id).then(
        (response) => {
          this.deliveryNoticeDetailData = response.data;
        }
      );
    },

    /** 重置 */
    reset() {
      this.getDeliveryNoticeDetail();
      this.getItemStorageDetailList();
      this.getAllotItemStorageDetailList();
    },

    // 取消按钮
    cancel() {
      this.detailTableList = [];
      this.allotDetailTableList = [];
      this.openVisible = false;
      this.$emit("refreshTable");
    },
    // 确定按钮
    submit() {
      this.detailTableList = [];
      this.allotDetailTableList = [];
      this.openVisible = false;
      this.$emit("refreshTable");
    },
    // 查看通知信息按钮
    handleDetail() {
      this.isShowNotice = !this.isShowNotice;
    },
    // 分配按钮
    handleAllot(row) {
      if (row.allotQuantity == null || row.allotQuantity == 0) {
        this.$message({
          type: "error",
          message: "请先分配数量!",
        });
        return;
      }
      if (row.allotQuantity < 0) {
        this.$message({
          type: "error",
          message: "分配数量不能小于0!",
        });
        return;
      }

      if (row.quantity < row.allotQuantity) {
        this.$message({
          type: "error",
          message: "分配数量不能大于库存数量!",
        });
        return;
      }

      row.relateId = this.deliveryNoticeDetailData.deliveryNoticeId;
      row.deliveryNoticeDetailId = this.deliveryNoticeDetailData.id;
      this.$confirm("确认分配吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          allotItemStorageDetail(row).then((response) => {
            this.$message({
              type: "success",
              message: "分配成功!",
            });
            this.reset();
          });
        })
        .catch(() => {});
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
      var requestData = [];
      this.detailTableList.forEach((item) => {
        if (this.ids.includes(item.id)) {
          item.relateId = this.deliveryNoticeDetailData.deliveryNoticeId;
          item.deliveryNoticeDetailId = this.deliveryNoticeDetailData.id;
          requestData.push(item);
        }
      });

      this.$confirm("确认分配吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          allotItemStorageDetailBatch(requestData).then((response) => {
            this.$message({
              type: "success",
              message: "分配成功!",
            });
            this.reset();
          });
        })
        .catch(() => {});
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
      var requestData = [];
      this.allotDetailTableList.forEach((item) => {
        if (this.allotIds.includes(item.id)) {
          item.deliveryNoticeDetailId = this.deliveryNoticeDetailData.id;
          requestData.push(item);
        }
      });

      this.$confirm("确认取消全部分配吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          cancelAllotItemStorageDetailBatch(requestData).then((response) => {
            this.$message({
              type: "success",
              message: "取消分配成功!",
            });
            this.reset();
          });
        })
        .catch(() => {});
    },

    // 取消
    handleCancel(row) {
      row.deliveryNoticeDetailId = this.deliveryNoticeDetailData.id;
      this.$confirm("确认取消分配吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          cancelAllotItemStorageDetail(row).then((response) => {
            this.$message({
              type: "success",
              message: "取消分配成功!",
            });
            this.reset();
          });
        })
        .catch(() => {});
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
    mathSub(x, args) {
      if (x != null && x != undefined && args != null) {
        return sub(x, args);
      }
    },
  },
};
</script>
