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
      </el-descriptions>

      <el-form
        ref="confirmForm"
        :model="confirmForm"
        :rules="confirmRules"
        label-width="120px"
        style="margin-top: 20px"
      >
        <el-col :span="6">
          <el-form-item label="发运结果" prop="deliveryResult">
            <el-select
              v-model="confirmForm.deliveryResult"
              placeholder="请选择发运结果"
              clearable
            >
              <el-option
                v-for="dict in dict.type.delivery_result"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select> </el-form-item
        ></el-col>

        <el-col :span="18">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="confirmForm.remark"
              placeholder="请输入备注"
              clearable
            /> </el-form-item
        ></el-col>
      </el-form>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>确认检查项</span>
        </div>
        <el-table
          v-loading="loading"
          :data="sureDictList"
          ref="multipleTable"
          :key="randomKey"
        >
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
          <!-- <el-table-column label="排序" align="center" prop="sort" /> -->
          <el-table-column label="温层" align="center" prop="thermosphere">
            <template slot-scope="scope">
              <dict-tag
                :options="dict.type.thermosphere"
                :value="scope.row.thermosphere"
              />
            </template>
          </el-table-column>
          <!-- <el-table-column type="selection" width="55" align="center">
            <template slot="header">
              <span>是否符合要求</span>
            </template>
          </el-table-column> -->
          <el-table-column label="是否符合要求" align="center" prop="result">
            <template slot-scope="scope">
              <el-checkbox
                v-model="scope.row.result"
                true-label="1"
                false-label="0"
                @change="refresh"
              />
            </template>
          </el-table-column>
        </el-table>

        <pagination
          small
          layout="total,prev, pager, next"
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getSureDict"
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
import { getSureDictList } from "@/api/system/deliverySureDict";
import {
  deliveryConfirm,
  deliveryConfirmInfo,
} from "@/api/warehouse/deliveryNotice";

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
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 是否显示通知信息
      isShowNotice: false,
      confirmForm: {
        deliveryResult: "",
        remark: "",
      },
      confirmRules: {
        deliveryResult: [
          { required: true, message: "请选择发运结果", trigger: "blur" },
        ],
      },
      isCheckAll: true,
      randomKey: Math.random(),
    };
  },
  created() {},
  methods: {
    // 获取列表数据
    getList(rowData) {
      this.openVisible = true;
      this.loading = true;
      this.getDeliveryConfirmInfo(rowData.id);
    },

    /** 查询出库确认项 */
    getSureDict() {
      this.loading = true;
      this.queryParams.businessType = this.deliveryNoticeData.businessType;
      this.queryParams.thermosphere = this.deliveryNoticeData.thermosphere;
      getSureDictList(this.queryParams).then((response) => {
        this.sureDictList = response.rows;
        this.total = response.total;
        this.loading = false;
        //默认全选
        this.$nextTick(() => {
          this.sureDictList.forEach((item) => {
            item.result = "1";
          });
          this.refresh();
        });
      });
    },

    // 查询出库确认信息
    getDeliveryConfirmInfo(id) {
      deliveryConfirmInfo(id).then((response) => {
        this.deliveryNoticeData = response.data;
        this.getSureDict();
      });
    },

    // 序号
    indexMethod(index) {
      return (
        (this.queryParams.pageNum - 1) * this.queryParams.pageSize + index + 1
      );
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
      this.$refs["confirmForm"].validate((valid) => {
        if (valid) {
          this.$modal.loading("出库确认中，请稍后...");
          let params = {
            deliveryNoticeId: this.deliveryNoticeData.id,
            wmsDeliverySureDetailList: this.sureDictList,
            deliveryResult: this.confirmForm.deliveryResult,
            remark: this.confirmForm.remark,
          };
          deliveryConfirm(params)
            .then((response) => {
              this.$modal.closeLoading();
              this.$message.success("操作成功");
              this.openVisible = false;
              this.$emit("refreshTable");
            })
            .catch(() => {
              this.$modal.closeLoading();
            });
        }
      });
      // this.openVisible = false;
    },
    // 查看通知信息按钮
    handleDetail() {
      this.isShowNotice = !this.isShowNotice;
    },

    refresh() {
      this.randomKey = Math.random();
    },

    handleCheakAll(val) {},
  },
};
</script>
