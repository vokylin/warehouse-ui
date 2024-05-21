<template>
  <div class="app-container">
    <el-dialog
      title="盘点详情"
      :visible.sync="openVisible"
      width="100%"
      :modal-append-to-body = "false"
      :loading="loading"
    >
      <el-descriptions title="盘点计划信息" border size="mini">
        <el-descriptions-item label="计划编码">{{
          inventoryPlanData.id
        }}</el-descriptions-item>
        <el-descriptions-item label="盘点方法">
          <dict-tag
            :options="dict.type.inventory_method"
            :value="inventoryPlanData.inventoryMethod"
            size="mini"
          />
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <dict-tag
            :options="dict.type.inventory_plan_status"
            :value="inventoryPlanData.status"
            size="mini"
          />
        </el-descriptions-item>
        <el-descriptions-item label="计划时间">
          {{ inventoryPlanData.planTime }}
        </el-descriptions-item>
        <el-descriptions-item label="开始时间">
          {{ inventoryPlanData.startTime }}
        </el-descriptions-item>
        <el-descriptions-item label="结束时间">
          {{ inventoryPlanData.endTime }}
        </el-descriptions-item>

        <el-descriptions-item label="审核人">
          {{ inventoryPlanData.reviewedBy }}
        </el-descriptions-item>

        <el-descriptions-item label="备注">{{
          inventoryPlanData.remark
        }}</el-descriptions-item>
      </el-descriptions>

      <el-card class="box-card" style="margin-top: 10px">
        <el-row :gutter="10" class="mb8" style="margin-top: 10px">
          <el-col :span="1.5">
            <el-select
              v-model="queryParams.warehouseId"
              placeholder="请选择仓库"
              size="mini"
              @change="getItemStorageDetailList"
            >
              <el-option
                v-for="item in warehouseList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-col>
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
                @click="getItemStorageDetailList"
              ></el-button>
              <el-button
                slot="append"
                icon="el-icon-refresh"
                @click="resetQuery"
              ></el-button>
            </el-input>
          </el-col>
        </el-row>
        <el-table v-loading="loading" :data="inventoryList">
          <el-table-column
            label="仓库"
            align="center"
            width="120"
            prop="warehouseName"
          />
          <el-table-column
            label="货位"
            align="center"
            width="120"
            prop="locationName"
          />
          <el-table-column
            label="物料名称"
            align="center"
            width="180"
            prop="itemName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="物料编码"
            align="center"
            width="180"
            prop="itemCode"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="物料批号"
            align="center"
            width="140"
            prop="batchNo"
          />
          <el-table-column label="单位" align="center" prop="unit" />
          <el-table-column
            label="物料规格"
            align="center"
            width="140"
            prop="spec"
          />
          <el-table-column label="单价" align="center" prop="price" width="140" />
          <el-table-column label="原始数量" align="center" prop="quantity" />
          <el-table-column
            label="盘点数量"
            align="center"
            prop="inventoryQuantity"
          >
          </el-table-column>
          <el-table-column
            label="差异数量"
            align="center"
            prop="diffQuantity"
          />
          <el-table-column
            label="参考金额"
            align="center"
            prop="referenceAmount"
          />
          <el-table-column label="库存状态" align="center" prop="storageStatus">
            <template slot-scope="scope">
              <dict-tag
                :options="dict.type.storage_status"
                :value="scope.row.storageStatus"
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
          <el-table-column label="差异分析" align="center" prop="diffAnalysis">
          </el-table-column>
        </el-table>
        <pagination
          small
          layout="total,prev, pager, next"
          v-show="inventoryTotal > 0"
          :total="inventoryTotal"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getItemStorageDetailList"
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
  listInventoryDetail,
  getInventoryDetail,
  delInventoryDetail,
  addInventoryDetail,
  updateInventoryDetail,
} from "@/api/warehouse/inventoryDetail";
import { getWarehouseList } from "@/api/system/warehouse";
import { mul } from "@/utils/math";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "brightDetail",
  dicts: ["storage_status", "inventory_plan_status", "inventory_method"],
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
      inventoryPlanData: {},
      // 库存明细数据
      inventoryList: [],
      inventoryTotal: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemCodeOrName: "",
        warehouseId: "",
        inventoryId: "",
      },
      ids: [],
      // 仓库下拉框数据
      warehouseList: [],
    };
  },
  created() {},
  methods: {
    // 获取列表数据
    start(rowData) {
      this.openVisible = true;
      this.loading = true;
      this.inventoryPlanData = rowData;
      this.getWarehouseList();
      this.getItemStorageDetailList();
    },

    /** 查询库存货品列表 */
    getItemStorageDetailList() {
      this.loading = true;
      this.queryParams.inventoryId = this.inventoryPlanData.id;
      listInventoryDetail(this.queryParams).then((response) => {
        this.inventoryList = response.rows;
        this.inventoryList.forEach((item) => {
          // 参考金额
          item.referenceAmount = mul(item.diffQuantity,item.price);
        });
        this.inventoryTotal = response.total;
        this.loading = false;
      });
    },

    /** 获取仓库下拉框数据 */
    getWarehouseList() {
      getWarehouseList().then((response) => {
        this.warehouseList = response.data;
      });
    },

    // 重置查询条件
    resetQuery() {
      this.queryParams.itemCodeOrName = "";
      this.queryParams.warehouseId = "";
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
