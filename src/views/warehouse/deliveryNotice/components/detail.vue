<template>
  <div class="app-container">
    <el-dialog
      title="出库通知详情"
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
            :options="dict.type.business_type_delivery"
            :value="receiveNoticeData.businessType"
          />
        </el-descriptions-item>
        <el-descriptions-item label="通知单号">{{
          receiveNoticeData.id
        }}</el-descriptions-item>
        <el-descriptions-item label="通知状态">
          <dict-tag
            :options="dict.type.delivery_notice_status"
            :value="receiveNoticeData.status"
          />
        </el-descriptions-item>
        <el-descriptions-item label="单据说明">{{
          receiveNoticeData.noticeDesc
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
              @click="getReceiveNoticeDetailList"
            ></el-button>
            <el-button
              slot="append"
              icon="el-icon-refresh-right"
              @click="refresh"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>通知明细</span>
        </div>
        <el-table v-loading="detailTableLoading" :data="detailTableList">
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
            label="业务数量"
            align="center"
            prop="businessQuantity"
            width="120"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.businessQuantity == 0">-</span>
              <span v-else
                >{{ scope.row.businessQuantity }} {{ scope.row.businessUnit }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="换算率" align="center" prop="conversionRate">
            <template slot-scope="scope">
              <span>{{
                scope.row.conversionRate ? scope.row.conversionRate : "-"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="通知数量" align="center" prop="quantity">
            <template slot-scope="scope">
              {{ scope.row.quantity }} {{ scope.row.itemUnit }}
            </template>
          </el-table-column>
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
          <el-table-column
            label="规格"
            width="120"
            align="center"
            prop="itemSpec"
            :show-overflow-tooltip="true"
          />
          <!-- <el-table-column label="业务编号" align="center" prop="businessNo" /> -->
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
  </div>
</template>

<script>
import { listDeliveryNoticeDetail } from "@/api/warehouse/deliveryNoticeDetail";
export default {
  dicts: [
    "delivery_type",
    "delivery_notice_status",
    "belongs_type",
    "business_type_delivery",
  ],
  name: "detail",
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
        deliveryNoticeId: "",
        itemCodeOrName: "",
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
      this.getReceiveNoticeDetailList();
    },

    /** 查询入库通知货品列表 */
    getReceiveNoticeDetailList() {
      this.detailTableLoading = true;
      this.detailTableQueryParams.deliveryNoticeId = this.receiveNoticeData.id;
      listDeliveryNoticeDetail(this.detailTableQueryParams).then((response) => {
        this.detailTableList = response.rows;
        this.detailTableTotal = response.total;
        this.detailTableLoading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.openVisible = false;
    },
    // 确定按钮
    submit() {
      this.openVisible = false;
    },
    // 查看通知信息按钮
    handleDetail() {
      this.isShowNotice = !this.isShowNotice;
    },
    // 刷新
    refresh() {
      this.detailTableQueryParams.itemCodeOrName = "";
      this.getReceiveNoticeDetailList();
    },
  },
};
</script>
