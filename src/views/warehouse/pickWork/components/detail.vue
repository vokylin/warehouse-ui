<template>
  <div class="app-container">
    <el-dialog
      title="作业详情"
      :visible.sync="openVisible"
      width="80%"
      append-to-body
      :loading="loading"
    >
      <el-descriptions title="作业信息" size="mini" border>
        <el-descriptions-item label="通知编号">{{
          workNoticeData.id
        }}</el-descriptions-item>
        <el-descriptions-item label="关联单号">{{
          workNoticeData.noticeId
        }}</el-descriptions-item>
        <el-descriptions-item label="业务单号">{{
          workNoticeData.noticeId
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
              @click="getPickingWorkNoticeDetail"
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
            label="物料批次"
            width="180"
            align="center"
            prop="batchNo"
          />
          <el-table-column label="仓库" align="center" prop="warehouseName" />
          <el-table-column label="货位" align="center" prop="locationName" />
          <el-table-column label="通知数量" align="center" prop="quantity" />
          <el-table-column
            label="完成数量"
            align="center"
            prop="allotQuantity"
          />
          <el-table-column
            label="缺货数量"
            align="center"
            prop="lackQuantity"
          />
          <el-table-column
            label="单位"
            width="80"
            align="center"
            prop="unit"
          />
          <el-table-column
            label="规格型号"
            width="140"
            align="center"
            prop="spec"
          />
        </el-table>
        <pagination
          small
          layout="total,prev, pager, next"
          v-show="detailTableTotal > 0"
          :total="detailTableTotal"
          :page.sync="detailTableQueryParams.pageNum"
          :limit.sync="detailTableQueryParams.pageSize"
          @pagination="getPickingWorkNoticeDetail"
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
import { listPickingWorkNoticeDetail } from "@/api/warehouse/pickingWorkNoticeDetail";
export default {
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
      workNoticeData: {},
      // 通知详情数据
      detailTableList: [],
      detailTableTotal: 0,
      detailTableQueryParams: {
        pageNum: 1,
        pageSize: 10,
        workNoticeId: "",
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
      this.workNoticeData = rowData;
      console.log("🚀 ~ file: detail.vue:132 ~ getList ~ rowData:", rowData);
      this.getPickingWorkNoticeDetail();
    },

    /** 查询入库通知货品列表 */
    getPickingWorkNoticeDetail() {
      this.detailTableLoading = true;
      this.detailTableQueryParams.workNoticeId = this.workNoticeData.id;
      listPickingWorkNoticeDetail(this.detailTableQueryParams).then(
        (response) => {
          this.detailTableList = response.rows;
          this.detailTableTotal = response.total;
          this.detailTableLoading = false;
        }
      );
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
      this.detailTableQueryParams.itemCodeOrName = "";
      this.getPickingWorkNoticeDetail();
    },
  },
};
</script>
