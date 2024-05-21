<template>
  <div class="app-container">
    <el-dialog
      title="出库确认"
      :visible.sync="openVisible"
      width="80%"
      append-to-body
      :loading="loading"
    >
      <el-descriptions title="通知信息" border :column="4">
        <el-descriptions-item label="通知单号">{{
          deliveryNoticeData.id
        }}</el-descriptions-item>
        <el-descriptions-item label="业务单号">{{
          deliveryNoticeData.businessId
        }}</el-descriptions-item>
        <el-descriptions-item label="单据类型">
          <dict-tag
            :options="dict.type.business_type_delivery"
            :value="deliveryNoticeData.businessType"
          />
        </el-descriptions-item>
        <el-descriptions-item label="温层">
          <dict-tag
            :options="dict.type.thermosphere"
            :value="deliveryNoticeData.thermosphere"
          />
        </el-descriptions-item>
        <el-descriptions-item label="总数量">{{
          deliveryNoticeData.totalQuantity
        }}</el-descriptions-item>
        <el-descriptions-item label="拣货数量">{{
          deliveryNoticeData.pickQuantity
        }}</el-descriptions-item>
        <el-descriptions-item label="实发数量">{{
          deliveryNoticeData.pickQuantity
        }}</el-descriptions-item>
        <el-descriptions-item label="收货方编码">{{
          deliveryNoticeData.toCode
        }}</el-descriptions-item>
        <el-descriptions-item label="收货方名称">{{
          deliveryNoticeData.toName
        }}</el-descriptions-item>
        <el-descriptions-item label="确认人">{{
          deliveryNoticeData.createUserName
        }}</el-descriptions-item>
        <el-descriptions-item label="确认时间">
          {{ parseTime(deliveryNoticeData.createTime) }}
        </el-descriptions-item>

        <el-descriptions-item label="发运结果">
          <dict-tag
            size="mini"
            :options="dict.type.delivery_result"
            :value="deliveryNoticeData.result"
          />
        </el-descriptions-item>
        <el-descriptions-item label="备注">{{
          deliveryNoticeData.remark
        }}</el-descriptions-item>
      </el-descriptions>

      <el-card class="box-card" shadow="hover" style="margin-top: 10px">
        <div slot="header" class="clearfix">
          <span>确认检查项</span>
        </div>
        <el-table v-loading="loading" :data="sureDictList" ref="multipleTable">
          <el-table-column
            type="index"
            width="55"
            label="序号"
            align="center"
            :index="indexMethod"
          />
          <el-table-column label="检查项" align="center" prop="checkItem" />
          <el-table-column
            label="要求"
            align="center"
            prop="checkRequirement"
          />
          <el-table-column
            width="120"
            align="center"
            label="是否符合要求"
            disabled
          >
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.isChecked" />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDeliverySureInfo } from "@/api/system/deliverySureDict";

export default {
  name: "deliveryConfirm",
  dicts: [
    "delivery_notice_status",
    "thermosphere",
    "business_type_delivery",
    "delivery_result",
    "delivery_type",
  ],
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
      showSearch: false,
      // 加载状态
      loading: false,
      // 收货通知数据
      deliveryNoticeData: {},
      // 通知详情数据
      sureDictList: [],
      // 是否显示通知信息
      isShowNotice: false,
    };
  },
  created() {},
  methods: {
    // 获取列表数据
    getList(rowData) {
      this.loading = true;
      this.getDeliveryConfirmInfo(rowData.id);
    },

    // 查询出库确认信息
    getDeliveryConfirmInfo(id) {
      getDeliverySureInfo(id).then((response) => {
        this.openVisible = true;
        this.deliveryNoticeData = response.data.deliveryNotice;
        this.deliveryNoticeData.result = response.data.result;
        this.deliveryNoticeData.remark = response.data.remark;
        this.deliveryNoticeData.createTime = response.data.createTime;
        this.deliveryNoticeData.createUserName = response.data.createUserName;
        this.sureDictList = response.data.deliverySureDetailList;
        if (this.sureDictList.length > 0) {
          this.sureDictList.forEach((item) => {
            item.isChecked = item.result === 1;
          });
        }
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },

    // 序号
    indexMethod(index) {
      return index + 1;
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    // 取消按钮
    cancel() {
      this.openVisible = false;
      this.$emit("refreshTable");
    },
    // 确定按钮
    submit() {
      this.deliveryNoticeData = {};
      this.sureDictList = [];
      this.openVisible = false;
      this.$emit("refreshTable");
    },
    canSelect() {
      return false;
    },
  },
};
</script>
