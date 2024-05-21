<template>
  <div class="app-container">
    <el-dialog
      title="作业详情"
      :visible.sync="openVisible"
      width="90%"
      append-to-body
      :loading="loading"
    >
      <el-descriptions title="通知信息" size="mini" border>
        <el-descriptions-item label="通知编号">{{
          workNoticeData.noticeId
        }}</el-descriptions-item>
        <el-descriptions-item label="项目编号">{{
          workNoticeData.businessId
        }}</el-descriptions-item>
        <el-descriptions-item label="关联单号">{{
          workNoticeData.businessId
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
              @click="getDetailList"
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
        <el-table
          v-loading="detailTableLoading"
          :data="detailTableList"
        >
          <el-table-column
            label="物料编码"
            width="180"
            align="center"
            prop="itemCode"
          />
          <el-table-column
            label="物料名称"
            width="180"
            :show-overflow-tooltip="true"
            align="center"
            prop="itemName"
          />
          <el-table-column
            label="物料批次"
            width="120"
            align="center"
            prop="batchNo"
          />
          <el-table-column label="通知数量" align="center" prop="quantity" />
          <el-table-column label="作业数量" align="center" prop="allotQuantity">
          </el-table-column>
          <el-table-column
            label="来源仓库"
            align="center"
            prop="sourceWarehouseName"
          />
          <el-table-column
            label="来源库位"
            align="center"
            width="120"
            prop="sourceLocationName"
          >
          </el-table-column>
        </el-table>
        <pagination
          small
          layout="total,prev, pager, next"
          v-show="detailTableTotal > 0"
          :total="detailTableTotal"
          :page.sync="detailTableQueryParams.pageNum"
          :limit.sync="detailTableQueryParams.pageSize"
          @pagination="getDetailList"
        />
      </el-card>

      <el-card class="box-card" body-style="padding='5px'" shadow="hover">
        <div slot="header" class="clearfix">
          <span>分配详情</span>
        </div>
        <el-table
          v-loading="itemDetailTableLoading"
          :data="workNoticeAllotList"
        >
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
            width="120"
            align="center"
            prop="batchNo"
          />
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
import { listWorkNoticeDetail } from "@/api/warehouse/workNoticeDetail";
import { listAll } from "@/api/system/storageUnit";
import { listWorkNoticeAllot } from "@/api/warehouse/workNoticeAllot";
export default {
  dicts: ["work_status", "refund_work_status", "receive_type"],
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
      // 分配详情数据
      workNoticeAllotList: [],
      workNoticeAllotTableTotal: 0,
      workNoticeAllotTableQueryParams: {
        pageNum: 1,
        pageSize: 10,
        workNoticeId: "",
      },
      // 是否显示通知信息
      isShowNotice: false,
    };
  },
  created() {
    this.getMinStorageUnit();
  },
  methods: {
    // 获取列表数据
    getList(rowData) {
      this.openVisible = true;
      this.loading = true;
      this.workNoticeData = rowData;
      this.getDetailList();
      this.getWorkNoticeAllotList();
    },

    // 查询最小存储单位
    getMinStorageUnit() {
      listAll({ isSmallestStorageUnit: 1 }).then((response) => {
        this.minStorageUnit = response.data;
      });
    },

    /** 查询入库通知货品列表 */
    getDetailList() {
      this.detailTableLoading = true;
      this.detailTableQueryParams.workNoticeId = this.workNoticeData.id;
      listWorkNoticeDetail(this.detailTableQueryParams).then((response) => {
        this.detailTableList = response.rows;
        this.detailTableTotal = response.total;
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
      this.getDetailList();
    },
  },
};
</script>
