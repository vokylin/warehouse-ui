<template>
  <div class="app-container">
    <el-dialog
      title="设置明细"
      :visible.sync="openVisible"
      width="100%"
      append-to-body
      :loading="loading"
    >
      <el-descriptions :column="3" border>
        <el-descriptions-item label="报损单号">{{
          breakageData.id
        }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <dict-tag
            :options="dict.type.breakage_doc_status"
            :value="breakageData.status"
          />
        </el-descriptions-item>
        <el-descriptions-item label="报损类型">
          <dict-tag
            :options="dict.type.breakage_doc_item_type"
            :value="breakageData.type"
          />
        </el-descriptions-item>
        <el-descriptions-item label="申请部门">
          {{ breakageData.officeName }}
        </el-descriptions-item>
        <el-descriptions-item label="申请人">{{
          breakageData.applicant
        }}</el-descriptions-item>
        <el-descriptions-item label="报损原因">
          <dict-tag
            :options="dict.type.scrap_reason"
            :value="breakageData.reason"
          />
        </el-descriptions-item>
      </el-descriptions>

      <el-card class="box-card" style="margin-top: 10px">
        <div slot="header" class="clearfix">
          <span>报损物料</span>
        </div>
        <el-table v-loading="breakageloading" :data="docDetailList">
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
            label="物料编码"
            width="180"
            align="center"
            prop="itemCode"
          />
          <el-table-column
            label="物料名称"
            width="180"
            align="center"
            prop="itemName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="批次"
            align="center"
            width="120"
            prop="batchNo"
          />
          <el-table-column label="数量" align="center" prop="quantity" />
          <el-table-column label="单位" align="center" prop="unit" />
          <el-table-column label="单价" align="center" prop="price" />
          <el-table-column label="金额" align="center" prop="amount" />
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
            label="过期日期"
            align="center"
            prop="expireDate"
            width="180"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.expireDate, "{y}-{m}-{d}") }}</span>
            </template>
          </el-table-column>
          <el-table-column label="不良原因" align="center" prop="badCauses" />
        </el-table>

        <pagination
          small
          layout="total,prev, pager, next"
          v-show="docDetailTotal > 0"
          :total="docDetailTotal"
          :page.sync="docDetailQueryParams.pageNum"
          :limit.sync="docDetailQueryParams.pageSize"
          @pagination="getdocDetailList"
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
import { listBreakageDocDetail } from "@/api/warehouse/breakageDoc";
import { mul } from "@/utils/math";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "detail",
  dicts: ["breakage_doc_item_type", "breakage_doc_status", "scrap_reason"],
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
      breakageloading: false,
      // 收货通知数据
      breakageData: {},
      // 报损货物列表
      docDetailList: [],
      docDetailTotal: 0,
      docDetailQueryParams: {
        pageNum: 1,
        pageSize: 10,
        breakageDocId: "",
      },
    };
  },
  created() {},
  methods: {
    // 获取列表数据
    start(rowData) {
      this.openVisible = true;
      this.loading = true;
      this.breakageData = rowData;
      this.getdocDetailList();
    },

    /** 查询已分配的数据 */
    getdocDetailList() {
      this.breakageloading = true;
      this.docDetailQueryParams.breakageDocId = this.breakageData.id;
      listBreakageDocDetail(this.docDetailQueryParams).then((response) => {
        this.breakageloading = false;
        this.docDetailList = response.rows;
        if (this.docDetailList.length > 0) {
          this.docDetailList.forEach((item) => {
            item.amount = mul(item.quantity,item.price);
          });
        }
        this.docDetailTotal = response.total;
      });
    },

    // 重置查询条件
    resetQuery() {
      this.itemQueryParams.itemCodeOrName = "";
      this.itemQueryParams.warehouseId = "";
      this.getItemStorageDetailList();
    },

    // 取消按钮
    cancel() {
      this.openVisible = false;
    },
    // 确定按钮
    submit() {
      this.openVisible = false;
    },
  },
};
</script>
