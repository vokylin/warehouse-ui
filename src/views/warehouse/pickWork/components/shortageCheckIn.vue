<template>
  <div class="app-container">
    <el-dialog
      title="拣货作业"
      :visible.sync="openVisible"
      width="90%"
      append-to-body
      :loading="loading"
      class="abow_dialog"
    >
      <el-descriptions title="作业信息" v-if="this.isShowNotice" border>
        <el-descriptions-item label="作业单号">{{
          workNoticeData.id
        }}</el-descriptions-item>
        <el-descriptions-item label="项目编号">{{
          workNoticeData.noticeId
        }}</el-descriptions-item>
        <el-descriptions-item label="通知单号">{{
          workNoticeData.noticeId
        }}</el-descriptions-item>
        <el-descriptions-item label="温层">{{
          workNoticeData.businessType
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
              @click="getPickingWorkNoticeDetailList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-card class="box-card" body-style="padding='5px'">
        <el-table
          v-loading="detailTableLoading"
          :data="detailTableList"
          :key="randomKey"
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <el-table-column
            label="物料名称"
            width="180"
            align="center"
            prop="itemName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="物料编码"
            width="180"
            align="center"
            prop="itemCode"
          />
          <el-table-column label="物料批次" align="center" prop="batchNo" />
          <el-table-column label="仓库" align="center" prop="warehouseName" />
          <el-table-column label="货位" align="center" prop="locationName" />
          <el-table-column label="拣货数量" align="center" prop="quantity" />
          <!-- <el-table-column
            label="完成数量"
            align="center"
            prop="allotQuantity"
          /> -->
          <el-table-column
            label="缺货数量"
            align="center"
            fixed="right"
            prop="lackQuantity"
            width="80"
          >
          </el-table-column>

          <el-table-column
            label="缺货登记"
            align="center"
            fixed="right"
            width="120"
          >
            <template slot-scope="scope">
              <el-input
                placeholder="请输入缺货数量"
                v-model="scope.row.currentLackQuantity"
                class="input-with-select"
                size="mini"
              >
                <el-button
                  slot="append"
                  size="mini"
                  type="text"
                  @click="handleCheckIn(scope.row)"
                  >登记</el-button
                >
              </el-input>
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
          @pagination="getPickingWorkNoticeDetailList"
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
  listPickingWorkNoticeDetail,
  shortageCheckIn,
} from "@/api/warehouse/pickingWorkNoticeDetail";
import Treeselect from "@riophae/vue-treeselect";
import { addition } from "@/utils/math";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "shortageCheckIn",
  components: {
    Treeselect,
  },
  props: {},
  data() {
    return {
      // 是否显示隐藏搜索
      showSearch: false,
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
        receiveNoticeId: "",
        itemCodeOrName: "",
      },
      // 是否显示通知信息
      isShowNotice: true,
      randomKey: Math.random(),
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
      this.workNoticeData = rowData;
      this.getPickingWorkNoticeDetailList();
      this.openVisible = true;
      this.loading = false;
    },

    /** 查询入库通知货品列表 */
    getPickingWorkNoticeDetailList() {
      this.detailTableLoading = true;
      this.detailTableQueryParams.workNoticeId = this.workNoticeData.id;
      listPickingWorkNoticeDetail(this.detailTableQueryParams).then(
        (response) => {
          this.detailTableList = response.rows;
          this.detailTableTotal = response.total;
          this.detailTableList.forEach((item) => {
            item.currentLackQuantity = 0;
          });
          this.detailTableLoading = false;
        }
      );
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

    // 缺货按钮
    handleCheckIn(row) {
      if (row.currentLackQuantity == null || row.currentLackQuantity == 0) {
        this.$message({
          type: "error",
          message: "请先填写数量!",
        });
        return;
      }
      if (row.currentLackQuantity < 0) {
        this.$message({
          type: "error",
          message: "缺货数量不能小于0!",
        });
        return;
      }
      if (row.quantity < addition(row.currentLackQuantity, row.lackQuantity)) {
        this.$message({
          type: "error",
          message: "缺货数量不能大于拣货数量!",
        });
        return;
      }
      this.$confirm("确认登记吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          shortageCheckIn(row).then((response) => {
            this.$message({
              type: "success",
              message: "登记成功!",
            });
            this.getPickingWorkNoticeDetailList();
          });
        })
        .catch(() => {});
    },

    refreshTable() {
      this.randomKey = Math.random();
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

<style></style>
