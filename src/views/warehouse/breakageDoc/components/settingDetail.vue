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

      <el-row style="margin-top: 10px">
        <el-col :span="12">
          <el-card class="box-card" body-style="padding='5px'">
            <el-row :gutter="10" class="mb8" style="margin-top: 10px">
              <el-col :span="1.5">
                <el-select
                  v-model="itemQueryParams.warehouseId"
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
                  v-model="itemQueryParams.itemCodeOrName"
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
              <el-col :span="1.5">
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleBatchCommit"
                  plain
                  >批量提交</el-button
                >
              </el-col>
            </el-row>
            <el-table
              v-loading="loading"
              :data="itemList"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center" />
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
              <el-table-column label="数量" align="center" prop="quantity" />
              <el-table-column
                label="单价"
                align="center"
                prop="actualPrice"
                width="120"
              />
              <el-table-column label="单位" align="center" prop="unit" />
              <el-table-column
                label="生产日期"
                align="center"
                prop="productDate"
                width="180"
              >
                <template slot-scope="scope">
                  <span>{{
                    parseTime(scope.row.productDate, "{y}-{m}-{d}")
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="过期日期"
                align="center"
                prop="expireDate"
                width="180"
              >
                <template slot-scope="scope">
                  <span>{{
                    parseTime(scope.row.expireDate, "{y}-{m}-{d}")
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="分配数量"
                align="center"
                fixed="right"
                prop="allotQuantity"
                width="120"
              >
                <template slot-scope="scope">
                  <el-input
                    :ref="scope.column.property"
                    v-model="scope.row.allotQuantity"
                    size="mini"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="不良原因"
                align="center"
                fixed="right"
                prop="badCauses"
                width="120"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.badCauses"
                    size="mini"
                  ></el-input>
                </template>
              </el-table-column>

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
                    @click="handleCommit(scope.row)"
                    >提交</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <pagination
              small
              layout="total,prev, pager, next"
              v-show="itemTotal > 0"
              :total="itemTotal"
              :page.sync="itemQueryParams.pageNum"
              :limit.sync="itemQueryParams.pageSize"
              @pagination="getItemStorageDetailList"
            />
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card" body-style="padding='5px'">
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button
                  type="danger"
                  plain
                  size="mini"
                  @click="handleCancelAll"
                  >批量取消</el-button
                >
              </el-col>
            </el-row>

            <el-table v-loading="breakageloading" :data="docDetailList">
              <el-table-column type="selection" width="55" align="center" />
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
              <el-table-column label="数量" align="center" prop="quantity" />
              <el-table-column label="单位" align="center" prop="unit" />
              <el-table-column label="单价" align="center" prop="price" />
              <el-table-column
                label="生产日期"
                align="center"
                prop="productDate"
                width="180"
              >
                <template slot-scope="scope">
                  <span>{{
                    parseTime(scope.row.productDate, "{y}-{m}-{d}")
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="过期日期"
                align="center"
                prop="expireDate"
                width="180"
              >
                <template slot-scope="scope">
                  <span>{{
                    parseTime(scope.row.expireDate, "{y}-{m}-{d}")
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="不良原因"
                align="center"
                prop="badCauses"
                width="180"
              >
              </el-table-column>
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
                    icon="el-icon-close"
                    @click="handleCancel(scope.row)"
                    >取消</el-button
                  >
                </template>
              </el-table-column>
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
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { breakageList } from "@/api/warehouse/itemStorageDetail";
import {
  listBreakageDocDetail,
  allotBatch,
  cancelBatch,
  updateBreakageDocDetail,
} from "@/api/warehouse/breakageDoc";
import { getWarehouseList } from "@/api/system/warehouse";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "settingDetail",
  dicts: ["breakage_doc_item_type", "breakage_doc_status","scrap_reason"],
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
      // 库存明细数据
      itemList: [],
      itemTotal: 0,
      itemQueryParams: {
        pageNum: 1,
        pageSize: 10,
        relateType: 0,
        workStatus: 0,
        storageStatus: 1,
        itemCodeOrName: "",
        warehouseId: "",
        itemType: "",
      },

      // 报损货物列表
      docDetailList: [],
      docDetailTotal: 0,
      docDetailQueryParams: {
        pageNum: 1,
        pageSize: 10,
        breakageDocId: "",
      },
      // 存储单元树
      storageUnitOptions: [],
      ids: [],
      allotIds: [],
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
      this.breakageData = rowData;
      this.getWarehouseList();
      this.getItemStorageDetailList();
      this.getdocDetailList();
    },

    /** 查询库存货品列表 */
    getItemStorageDetailList() {
      this.loading = true;
      this.itemQueryParams.itemType = this.breakageData.type;
      breakageList(this.itemQueryParams).then((response) => {
        this.itemList = response.rows;
        // 设置默认分配数量
        this.itemList.forEach((item) => {
          item.allotQuantity = 0;
          item.relateId = this.breakageData.id;
        });

        this.itemTotal = response.total;
        this.loading = false;
      });
    },

    /** 查询已分配的数据 */
    getdocDetailList() {
      this.breakageloading = true;
      this.docDetailQueryParams.breakageDocId = this.breakageData.id;
      listBreakageDocDetail(this.docDetailQueryParams).then((response) => {
        this.breakageloading = false;
        this.docDetailList = response.rows;
        this.docDetailTotal = response.total;
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
      this.itemQueryParams.itemCodeOrName = "";
      this.itemQueryParams.warehouseId = "";
      this.getItemStorageDetailList();
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
    },

    // 多选框选中数据
    handleSelectionChangeAllot(selection) {
      this.allotIds = selection.map((item) => item.id);
    },

    // 取消按钮
    cancel() {
      this.openVisible = false;
    },
    // 确定按钮
    submit() {
      this.openVisible = false;
    },

    // 批量提交
    handleBatchCommit() {},
    // 批量取消
    handleCancelAll() {},

    // 提交
    handleCommit(row) {
      if (this.checkCommit(row)) {
        allotBatch([row]).then((response) => {
          this.$message.success("提交成功");
          this.getItemStorageDetailList();
          this.getdocDetailList();
        });
      }
    },

    // 不良原因提交
    handleUpdate(row) {
      updateBreakageDocDetail(row).then((response) => {
        this.$message.success("提交成功");
        this.getItemStorageDetailList();
        this.getdocDetailList();
      });
    },
    // 取消
    handleCancel(row) {
      cancelBatch([row]).then((response) => {
        this.$message.success("取消成功");
        this.getItemStorageDetailList();
        this.getdocDetailList();
      });
    },

    checkCommit(row) {
      if (row.allotQuantity == "" || row.allotQuantity == null) {
        this.$message.error("分配数量不能为空");
        return false;
      }
      // 正则校验
      const reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
      if (!reg.test(row.allotQuantity)) {
        this.$message.error("分配数量格式不正确");
        return false;
      }
      if (row.allotQuantity == 0) {
        this.$message.error("分配数量不能为0");
        return false;
      }
      if (row.allotQuantity < 0) {
        this.$message.error("分配数量不能小于0");
        return false;
      }

      if (row.quantity < row.allotQuantity) {
        this.$message.error("分配数量不能大于库存数量");
        return false;
      }
      return true;
    },
  },
};
</script>
