<template>
  <div class="app-container">
    <el-dialog
      title="入库上架"
      :visible.sync="openVisible"
      width="80%"
      append-to-body
      :loading="loading"
    >
      <el-descriptions title="通知信息" :column="4" size="mini" border>
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
          <el-button
            type="primary"
            size="mini"
            plain
            @click="handleBatchReceipt"
            >批量上架</el-button
          >
        </el-col>
      </el-row>

      <el-card class="box-card">
        <el-table
          v-loading="itemDetailTableLoading"
          :data="itemDetailTableList"
          @selection-change="handleSelectionChange"
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
            width="120"
            align="center"
            prop="batchNo"
          />
          <!-- <el-table-column label="单位" align="center" prop="unit" /> -->
          <el-table-column
            label="分配数量"
            width="160"
            align="center"
            prop="quantity"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.quantity }} {{ scope.row.unit }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="合格数量"
            width="160"
            align="center"
            prop="passQuantity"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.passQuantity }} {{ scope.row.unit }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="不合格数量"
            width="160"
            align="center"
            prop="failQuantity"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.failQuantity }} {{ scope.row.unit }}</span>
            </template>
          </el-table-column>
          <el-table-column label="质检状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag
                :options="dict.type.recive_item_status"
                :value="scope.row.status"
              />
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
            label="操作"
            align="center"
            fixed="right"
            width="120"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-upload2"
                @click="handleShelves(scope.row)"
                v-if="
                  scope.row.status === 2 &&
                  scope.row.workStatus !== 2 &&
                  scope.row.passQuantity > 0
                "
                >上架作业</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-upload2"
                @click="handleShelves(scope.row)"
                v-if="
                  scope.row.status === 3 &&
                  scope.row.workStatus !== 2 &&
                  scope.row.failQuantity > 0
                "
                >上架作业</el-button
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
  listWmsReceiveItemDetail,
  shelves,
  batchShelves,
} from "@/api/warehouse/receiveItemDetail";

export default {
  dicts: [
    "receipt_status",
    "recive_item_status",
    "item_type",
    "receive_type",
    "recive_notice_status",
    "business_type_receive",
  ],
  name: "batchReceipt",
  props: {},
  data() {
    return {
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 弹窗是否显示
      openVisible: false,
      // 加载状态
      loading: false,
      detailTableLoading: false,
      itemDetailTableLoading: false,
      // 收货通知数据
      receiveNoticeData: {},
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
    };
  },
  created() {},
  methods: {
    // 获取列表数据
    getList(rowData) {
      this.openVisible = true;
      this.loading = true;
      this.receiveNoticeData = rowData;
      this.getReceiveItemDetailList();
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
    // 多选框是否禁用
    canSelect(row) {
      return row.workStatus !== 2;
    },
    // 上架按钮
    handleShelves(row) {
      shelves(row).then((response) => {
        this.$message({
          type: "success",
          message: "生成上架作业成功!",
        });
        this.getReceiveItemDetailList();
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    // 批量上架按钮
    handleBatchReceipt() {
      if (this.ids.length === 0) {
        this.$message({
          type: "warning",
          message: "请选择要上架的物料!",
        });
        return;
      }

      var data = {
        ids: this.ids,
        receiveNoticeId: this.receiveNoticeData.id,
      };

      this.$confirm("确认生成上架作业吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$modal.loading("生成上架作业中...");
          batchShelves(data)
            .then((response) => {
              this.$message({
                type: "success",
                message: "生成上架作业成功!",
              });
              this.getReceiveItemDetailList();
              this.$modal.closeLoading();
            })
            .catch(() => {
              this.$modal.closeLoading();
            });
        })
        .catch(() => {});
    },
  },
};
</script>
