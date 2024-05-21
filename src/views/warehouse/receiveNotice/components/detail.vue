<template>
  <div class="app-container">
    <el-dialog
      title="入库通知详情"
      :visible.sync="openVisible"
      width="100%"
      append-to-body
      :loading="loading"
      top="0vh"
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
          <el-input
            placeholder="请输入物料编码/名称"
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
        <el-table
          v-loading="detailTableLoading"
          :data="detailTableList"
          :default-sort="defaultSort"
          @sort-change="handleSortChange"
        >
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
            :show-overflow-tooltip="true"
            prop="itemName"
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
          />
          <el-table-column
            label="批次"
            align="center"
            width="140"
            prop="batchNo"
          />
          <el-table-column
            label="物料类型"
            align="center"
            prop="itemType"
            width="120"
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.itemType === null">-</span>
              <dict-tag
                v-else
                :options="dict.type.item_type"
                :value="scope.row.itemType"
              />
            </template>
          </el-table-column>
          <!-- <el-table-column
            label="状态"
            align="center"
            prop="status"
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
          >
            <template slot-scope="scope">
              <dict-tag
                :options="dict.type.receipt_status"
                :value="scope.row.status"
              />
            </template>
          </el-table-column> -->
          <el-table-column
            label="业务数量"
            align="center"
            prop="businessQuantity"
            width="120"
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
          >
            <template slot-scope="scope">
              <span
                v-if="
                  scope.row.businessQuantity === null ||
                  scope.row.businessQuantity == 0
                "
                >-</span
              >
              <span v-else
                >{{ scope.row.businessQuantity }}
                {{ scope.row.businesUnit }}</span
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
          <!--<el-table-column
            label="所属单位类型 "
            width="140"
            align="center"
            prop="belongs"
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
          >
                     <template slot-scope="scope">
              <dict-tag
                :options="dict.type.belongs_type"
                :value="scope.row.belongs"
              />
            </template>
          </el-table-column>-->
          <el-table-column
            label="物料规格"
            width="120"
            align="center"
            prop="spec"
          />
          <!-- <el-table-column label="物料税率" align="center" prop="tax" /> -->
          <el-table-column
            label="待检位置"
            align="center"
            prop="locationName"
            width="120"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row.locationName ? scope.row.locationName : "-"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="生产日期"
            width="160"
            align="center"
            prop="productDate"
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.productDate, "{y}-{m}-{d}") }}</span>
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
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>分配明细</span>
        </div>
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
            align="center"
            prop="itemName"
            width="240"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="批次"
            width="160"
            align="center"
            prop="batchNo"
          />
          <!-- <el-table-column label="单位" align="center" prop="unit" /> -->
          <el-table-column label="分配数量" align="center" prop="quantity">
          </el-table-column>
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
          <el-table-column
            label="质检状态"
            align="center"
            width="80"
            prop="status"
          >
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
            prop="keepQuantity"
            width="140"
          />
          <el-table-column
            label="质检抽样数量"
            align="center"
            prop="sampleQuantity"
            width="140"
          />
          <el-table-column
            label="抽样退还数量"
            align="center"
            prop="sampleRefundQuantity"
            width="140"
          />
          <el-table-column
            label="退货数量"
            align="center"
            prop="refundQuantity"
            width="140"
          />

          <el-table-column label="单位" align="center" prop="unit" />

          <!-- <el-table-column label="物料单价" align="center" prop="price" /> -->
          <el-table-column label="生产日期" width="120" align="center" prop="productDate">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.productDate, "{y}-{m}-{d}") }}</span>
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
import { listAll } from "@/api/system/storageUnit";
import { listWmsReceiveNoticeDetail } from "@/api/warehouse/receiveNoticeDetail";
import { listWmsReceiveItemDetail } from "@/api/warehouse/receiveItemDetail";

export default {
  name: "detail",
  dicts: [
    "receipt_status",
    "recive_item_status",
    "item_type",
    "receive_type",
    "recive_notice_status",
    "belongs_type",
    "business_type_receive",
  ],
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
      // 默认排序
      defaultSort: { prop: "itemType", order: "descending" },
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
      this.getReceiveItemDetailList();
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
      this.getReceiveNoticeDetailList();
    },
  },
};
</script>
