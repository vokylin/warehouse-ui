<template>
  <div class="app-container">
    <el-dialog
      title="入库通知详情"
      :visible.sync="openVisible"
      width="80%"
      append-to-body
      :loading="loading"
    >
      <el-descriptions title="通知信息" size="mini" :column="4" border>
        <el-descriptions-item label="发运单号">{{
          deliveryData.id
        }}</el-descriptions-item>
        <el-descriptions-item label="业务单号">{{
          deliveryData.businessId
        }}</el-descriptions-item>
        <el-descriptions-item label="单据类型">
          <dict-tag
            :options="dict.type.business_type_delivery"
            :value="deliveryData.businessType"
          />
        </el-descriptions-item>
        <el-descriptions-item label="总数量">{{
          deliveryData.planQuantity
        }}</el-descriptions-item>
        <el-descriptions-item label="实发数量">{{
          deliveryData.quantity
        }}</el-descriptions-item>
        <el-descriptions-item label="收货方名称">{{
          deliveryData.customerName
        }}</el-descriptions-item>
        <el-descriptions-item label="收货方编码">{{
          deliveryData.customerCode
        }}</el-descriptions-item>
      </el-descriptions>

      <el-row :gutter="10" class="mb8" style="margin-top: 10px">
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

      <el-card class="box-card" style="margin-top: 20px" shadow="hover">
        <div slot="header" class="clearfix">
          <span>通知明细</span>
        </div>
        <el-table v-loading="detailTableLoading" :data="list">
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
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
          />
          <el-table-column label="通知数量" align="center" prop="quantity" />
          <el-table-column
            label="分配数量"
            align="center"
            prop="allotQuantity"
          />
          <el-table-column
            label="作业数量"
            align="center"
            prop="workQuantity"
          />
          <el-table-column
            label="作业完成数量"
            align="center"
            width="120"
            prop="workFinishQuantity"
          />
          <el-table-column
            label="发货数量"
            align="center"
            prop="deliveryQuantity"
          />
          <el-table-column label="单位" align="center" prop="itemUnit" />
          <el-table-column label="规格" align="center" prop="itemSpec" />
          <el-table-column
            label="业务单位数量"
            align="center"
            prop="businessQuantity"
            width="120"
          />
          <el-table-column
            label="业务单位"
            align="center"
            prop="businessUnit"
          />
          <el-table-column
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
          />
        </el-table>
        <pagination
          small
          layout="total,prev, pager, next"
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
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
  name: "detail",
  props: {},
  dicts: ["belongs_type", "delivery_type","business_type_delivery"],
  data() {
    return {
      // 弹窗是否显示
      openVisible: false,
      // 加载状态
      loading: false,
      detailTableLoading: false,
      itemDetailTableLoading: false,
      // 发货通知
      deliveryData: {},
      // 发运通知详情
      list: [],
      total: 0,
      queryParams: {
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
      this.deliveryData = rowData;
      this.getReceiveNoticeDetailList();
    },

    /** 查询入库通知货品列表 */
    getReceiveNoticeDetailList() {
      this.detailTableLoading = true;
      this.queryParams.deliveryNoticeId = this.deliveryData.deliveryNoticeId;
      listDeliveryNoticeDetail(this.queryParams).then((response) => {
        this.list = response.rows;
        this.total = response.total;
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
    // 刷新按钮
    refresh() {
      this.queryParams.itemCodeOrName = "";
      this.getReceiveNoticeDetailList();
    },
  },
};
</script>
