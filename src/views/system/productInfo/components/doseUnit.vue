<template>
  <div class="app-container">
    <el-dialog
      title="单位换算"
      :visible.sync="openVisible"
      width="80%"
      append-to-body
      :loading="loading"
    >
      <el-card class="box-card">
        <el-table v-loading="doseUnitLoading" :data="doseUnitList">
          <el-table-column label="商品编码" align="center" prop="productCode" />
          <el-table-column label="商品名称" align="center" prop="productName" />
          <el-table-column
            label="主计量单位"
            align="center"
            prop="masterUnit"
          />
          <el-table-column
            label="换算率"
            align="center"
            prop="conversionRate"
          />
          <el-table-column
            label="类型"
            align="center"
            prop="belongs"
          >
          <!-- sales-销售 purchase-采购 manufacture-生产 warehouse-库存剂量单位 -->
            <template slot-scope="scope">
              <span v-if="scope.row.belongs === 'sales'">销售</span>
              <span v-if="scope.row.belongs === 'purchase'">采购</span>
              <span v-if="scope.row.belongs === 'manufacture'">生产</span>
              <span v-if="scope.row.belongs === 'warehouse'">库存</span>
            </template>
        </el-table-column>
          <el-table-column
            label="业务单位"
            align="center"
            prop="doseUnit"
          />
        </el-table>

        <pagination
          small
          layout="total,prev, pager, next"
          v-show="doseUnitTotal > 0"
          :total="doseUnitTotal"
          :page.sync="doseUnitQueryParams.pageNum"
          :limit.sync="doseUnitQueryParams.pageSize"
          @pagination="getDoseUnitList"
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
import { listDoseUnit } from "@/api/system/doseUnit";
export default {
  name: "doseUnit",
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
      doseUnitLoading: false,
      // 库存汇总数据
      itemStorageData: {},
      // 单位换算
      doseUnitList: [],
      doseUnitTotal: 0,
      doseUnitQueryParams: {
        pageNum: 1,
        pageSize: 10,
        productCode: "",
      },
      // 是否显示通知信息
      isShowNotice: false,
    };
  },
  created() {},
  methods: {
    // 获取列表数据
    getList(rowData) {
      console.log("🚀 ~ file: doseUnit.vue:90 ~ getList ~ rowData:", rowData)
      this.openVisible = true;
      this.loading = true;
      this.itemStorageData = rowData;
      this.getDoseUnitList();
    },

    /** 查询单位换算列表 */
    getDoseUnitList() {
      this.doseUnitLoading = true;
      this.doseUnitQueryParams.productCode = this.itemStorageData.productCode;
      listDoseUnit(this.doseUnitQueryParams).then((response) => {
        this.doseUnitList = response.rows;
        this.doseUnitTotal = response.total;
        this.doseUnitLoading = false;
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

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
  },
};
</script>
