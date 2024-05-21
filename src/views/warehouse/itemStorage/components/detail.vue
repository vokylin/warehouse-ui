<template>
  <div class="app-container">
    <el-dialog
      title="入库通知详情"
      :visible.sync="openVisible"
      width="80%"
      append-to-body
      :loading="loading"
    >
      <el-descriptions title="汇总信息" border>
        <el-descriptions-item label="物料编码">{{
          itemStorageData.itemCode
        }}</el-descriptions-item>
        <el-descriptions-item label="物料名称">{{
          itemStorageData.itemName
        }}</el-descriptions-item>
        <el-descriptions-item label="总数量">
          {{ itemStorageData.quantity }}
        </el-descriptions-item>
        <el-descriptions-item label="实时单价">{{
          itemStorageData.actualPrice
        }}</el-descriptions-item>
      </el-descriptions>

      <el-row :gutter="10" class="mb8" style="margin-top: 10px">
        <el-col :span="1.5">
          <el-input
            placeholder="请输入货品编码/名称"
            v-model="detailTableQueryParams.itemCodeOrName"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getItemStorageDetailList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-card class="box-card">
        <el-table
          v-loading="detailTableLoading"
          :data="detailTableList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <!-- <el-table-column label="ID" align="center" prop="id" /> -->
          <!-- <el-table-column label="库存ID" align="center" prop="storageId" /> -->
          <el-table-column label="物料批号" align="center" prop="batchNo" />
          <el-table-column label="数量" align="center" prop="quantity" />
          <el-table-column label="货位ID" align="center" prop="locationId" />
          <el-table-column
            label="库存状态"
            align="center"
            prop="storageStatus"
          />
          <el-table-column label="作业状态" align="center" prop="workStatus" />
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
          <el-table-column label="温层" align="center" prop="thermosphere" />
          <el-table-column
            label="关联业务类型"
            align="center"
            prop="relateType"
          />
          <!-- <el-table-column label="关联业务ID" align="center" prop="relateId" /> -->
          <!-- <el-table-column
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['warehouse:itemStorageDetail:edit']"
                >修改</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['warehouse:itemStorageDetail:remove']"
                >删除</el-button
              >
            </template>
          </el-table-column> -->
        </el-table>

        <pagination
          small
          layout="total,prev, pager, next"
          v-show="detailTableTotal > 0"
          :total="detailTableTotal"
          :page.sync="detailTableQueryParams.pageNum"
          :limit.sync="detailTableQueryParams.pageSize"
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
import { listItemStorageDetail } from "@/api/warehouse/itemStorageDetail";

export default {
  name: "detail",
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
      detailTableLoading: false,
      itemDetailTableLoading: false,
      // 库存汇总数据
      itemStorageData: {},
      // 通知详情数据
      detailTableList: [],
      detailTableTotal: 0,
      detailTableQueryParams: {
        pageNum: 1,
        pageSize: 10,
        storageId: "",
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
      this.itemStorageData = rowData;
      this.getItemStorageDetailList();
    },

    /** 查询入库通知货品列表 */
    getItemStorageDetailList() {
      this.detailTableLoading = true;
      this.detailTableQueryParams.storageId = this.itemStorageData.id;
      listItemStorageDetail(this.detailTableQueryParams).then((response) => {
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

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
  },
};
</script>
