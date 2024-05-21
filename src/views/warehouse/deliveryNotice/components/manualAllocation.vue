<template>
  <div class="app-container">
    <el-dialog
      title="手动分配"
      :visible.sync="openVisible"
      width="80%"
      append-to-body
      :loading="loading"
    >
      <el-descriptions title="通知信息" :column="4" border>
        <el-descriptions-item label="通知单号">{{
          deliveryNoticeData.id
        }}</el-descriptions-item>
        <el-descriptions-item label="业务单号">{{
          deliveryNoticeData.businessId
        }}</el-descriptions-item>
        <el-descriptions-item label="单据类型">
          <dict-tag
            :options="dict.type.business_type_delivery"
            :value="deliveryNoticeData.businessType"
          />
        </el-descriptions-item>
        <el-descriptions-item label="总数量">{{
          deliveryNoticeData.quantity
        }}</el-descriptions-item>
        <el-descriptions-item label="收货方名称">{{
          deliveryNoticeData.toCode
        }}</el-descriptions-item>
        <el-descriptions-item label="收货方编码">{{
          deliveryNoticeData.toName
        }}</el-descriptions-item>
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
              size="mini"
              @click="getReceiveNoticeDetailList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="1.5">
          <el-button size="mini" plain type="danger" @click="handleCancelAllot">
            取消分配
          </el-button>
        </el-col>
      </el-row>

      <el-card class="box-card" body-style="padding='5px'">
        <el-table
          v-loading="detailTableLoading"
          :data="detailTableList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
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
          <el-table-column label="通知数量" align="center" prop="quantity">
            <template slot-scope="scope">
              {{ scope.row.quantity }} {{ scope.row.itemUnit }}
            </template>
          </el-table-column>

          <!-- <el-table-column
            label="业务数量"
            align="center"
            prop="businessQuantity"
            width="120"
          >
            <template slot-scope="scope">
              {{ scope.row.businessQuantity }} {{ scope.row.businessUnit }}
            </template>
          </el-table-column> -->

          <el-table-column
            label="分配中数量"
            align="center"
            width="120"
            prop="allotQuantity"
          >
            <template slot-scope="scope">
              {{ scope.row.allotQuantity }} {{ scope.row.itemUnit }}
            </template>
          </el-table-column>
          <el-table-column
            label="作业中数量"
            align="center"
            width="120"
            prop="workQuantity"
          >
            <template slot-scope="scope">
              {{ scope.row.workQuantity }} {{ scope.row.itemUnit }}
            </template>
          </el-table-column>
          <el-table-column
            label="作业完成数量"
            align="center"
            width="120"
            prop="workFinishQuantity"
          >
            <template slot-scope="scope">
              {{ scope.row.workFinishQuantity }} {{ scope.row.itemUnit }}
            </template>
          </el-table-column>
          <el-table-column
            label="发货数量"
            align="center"
            prop="deliveryQuantity"
          >
            <template slot-scope="scope">
              {{ scope.row.deliveryQuantity }} {{ scope.row.itemUnit }}
            </template>
          </el-table-column>
          <!-- <el-table-column label="单位" align="center" prop="itemUnit" /> -->
          <el-table-column
            label="规格"
            align="center"
            prop="itemSpec"
            width="120"
            :show-overflow-tooltip="true"
          />
          <!-- <el-table-column
            label="所属单位类型"
            align="center"
            prop="belongs"
            width="120"
          >
            <template slot-scope="scope">
              <dict-tag
                :options="dict.type.belongs_type"
                :value="scope.row.belongs"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="换算率"
            align="center"
            prop="conversionRate"
          /> -->
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
          @pagination="getReceiveNoticeDetailList"
        />
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 分配弹框 -->
    <allocation ref="allocation" @refreshTable="refreshTable"></allocation>
  </div>
</template>

<script>
import {
  listDeliveryNoticeDetail,
  cancelAllot,
} from "@/api/warehouse/deliveryNoticeDetail";
import allocation from "../components/allocation";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  dicts: [
    "delivery_notice_status",
    "thermosphere",
    "business_type_delivery",
    "delivery_type",
    "belongs_type",
  ],
  name: "manualAllocation",
  components: {
    Treeselect,
    allocation,
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
      deliveryNoticeData: {},
      // 通知详情数据
      detailTableList: [],
      detailTableTotal: 0,
      detailTableQueryParams: {
        pageNum: 1,
        pageSize: 10,
        deliveryNoticeId: "",
        itemCodeOrName: "",
      },
      // 是否显示通知信息
      isShowNotice: false,
      // 存储单元树
      storageUnitOptions: [],
      // 存储位置
      locationId: "",
      ids: [],
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
      this.deliveryNoticeData = rowData;
      this.getReceiveNoticeDetailList();
      this.deliveryNoticeData.quantity = 0;
      this.detailTableList.forEach((item) => {
        this.deliveryNoticeData.quantity += item.quantity;
      });
      this.openVisible = true;
      this.loading = false;
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    /** 查询入库通知货品列表 */
    getReceiveNoticeDetailList() {
      this.detailTableLoading = true;
      this.detailTableQueryParams.deliveryNoticeId = this.deliveryNoticeData.id;
      listDeliveryNoticeDetail(this.detailTableQueryParams).then((response) => {
        this.detailTableList = response.rows;
        this.detailTableTotal = response.total;
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
    // 查看通知信息按钮
    handleDetail() {
      this.isShowNotice = !this.isShowNotice;
    },

    // 分配按钮
    handleAllot(row) {
      this.$refs.allocation.start(row);
    },

    // 取消分配
    handleCancelAllot() {
      if (this.ids.length === 0) {
        this.$message.warning("请选择要取消分配的数据");
        return;
      }
      this.$confirm("此操作将取消分配, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        cancelAllot(this.ids).then(() => {
          this.$message.success("取消分配成功");
          this.getReceiveNoticeDetailList();
        });
      });
    },
    // 刷新列表
    refreshTable() {
      this.getReceiveNoticeDetailList();
    },
  },
};
</script>

<style></style>
