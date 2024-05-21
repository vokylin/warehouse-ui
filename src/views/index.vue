<template>
  <div class="app-container home">
    <el-card
      style="margin-top: 10px"
      shadow="hover"
      v-if="checkPermi(['warehouse:receiveNotice:list'])"
    >
      <div slot="header" class="clearfix">
        <span>待处理入库通知</span>
        <el-button
          style="float: right; padding: 3px 0"
          icon="el-icon-refresh-left"
          size="mini"
          type="text"
          @click="getReceiveList"
        ></el-button>
      </div>

      <el-table v-loading="receiveLoading" :data="receiveList" size="mini">
        <el-table-column label="收货单号" width="180" align="center" prop="id">
        </el-table-column>
        <el-table-column label="通知状态" align="center" prop="status">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.recive_notice_status"
              :value="scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="业务系统单号"
          width="180"
          align="center"
          prop="businessId"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.businessId ? scope.row.businessId : "-" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="单据类型"
          align="center"
          prop="businessType"
          width="180"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.businessType == null">-</span>
            <dict-tag
              v-else
              :options="dict.type.business_type_receive"
              :value="scope.row.businessType"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="收发类别"
          align="center"
          prop="receiveSendType"
          width="180"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.receiveSendType == null">-</span>
            <dict-tag
              v-else
              :options="dict.type.receive_type"
              :value="scope.row.receiveSendType"
            />
          </template>
        </el-table-column>
        <el-table-column label="通知人" align="center" prop="noticeUser" />
        <el-table-column
          label="通知时间"
          align="center"
          prop="noticeTime"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.noticeTime
                ? parseTime(scope.row.noticeTime, "{y}-{m}-{d} {h}:{i}:{s}")
                : "-"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="单据说明"
          align="center"
          width="120"
          prop="noticeDesc"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.noticeDesc ? scope.row.noticeDesc : "-" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="240">
          <template>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-document"
              @click="gotoReceiveNotice"
              v-hasPermi="['warehouse:receiveNotice:active']"
              >前往作业</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        small
        layout="total,prev, pager, next"
        v-show="receiveTotal > 0"
        :total="receiveTotal"
        :page.sync="receiveParams.pageNum"
        :limit.sync="receiveParams.pageSize"
        @pagination="getReceiveList"
      />
    </el-card>

    <el-card
      style="margin-top: 10px"
      shadow="hover"
      v-if="checkPermi(['warehouse:deliveryNotice:list'])"
    >
      <div slot="header" class="clearfix">
        <span>待处理出库通知</span>
        <el-button
          style="float: right; padding: 3px 0"
          icon="el-icon-refresh-left"
          size="mini"
          type="text"
          @click="getDeliveryList"
        ></el-button>
      </div>
      <el-table v-loading="deliveryLoading" :data="deliveryList" size="mini">
        <el-table-column
          label="出库通知编号"
          width="180"
          align="center"
          prop="id"
        >
        </el-table-column>
        <el-table-column
          label="业务系统单号"
          width="180"
          align="center"
          prop="businessId"
        >
        </el-table-column>
        <el-table-column
          label="单据类型"
          align="center"
          width="120"
          prop="businessType"
        >
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.business_type_delivery"
              :value="scope.row.businessType"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="收发类型"
          align="center"
          width="240"
          prop="receiveSendType"
        >
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.delivery_type"
              :value="scope.row.receiveSendType"
            />
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.delivery_notice_status"
              :value="scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="通知说明"
          align="center"
          width="180"
          prop="noticeDesc"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="通知时间"
          align="center"
          width="180"
          prop="createTime"
        >
          <template slot-scope="scope">
            <span>{{
              parseTime(scope.row.createTime, "{y}-{m}-{d} {h}:{i}:{s}")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="240">
          <template>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-document"
              @click="gotoDeliveryNotice"
              v-hasPermi="['warehouse:deliveryNotice:active']"
              >前往作业</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <pagination
        small
        layout="total,prev, pager, next"
        v-show="deliveryTotal > 0"
        :total="deliveryTotal"
        :page.sync="deliveryParams.pageNum"
        :limit.sync="deliveryParams.pageSize"
        @pagination="getDeliveryList"
      />
    </el-card>

    <el-card style="margin-top: 10px" shadow="hover">
      <div slot="header" class="clearfix">
        <span>库存预警</span>
        <el-button
          style="float: right; padding: 3px 0"
          icon="el-icon-refresh-left"
          size="mini"
          type="text"
          @click="getStorageCount"
        ></el-button>
      </div>

      <el-table v-loading="storageLoading" :data="storageList" size="mini">
        <el-table-column label="物料编码" align="center" prop="itemCode" />
        <el-table-column label="物料名称" align="center" prop="itemName" />
        <el-table-column label="规格型号" align="center" prop="spec" />
        <el-table-column label="单位" align="center" prop="unit" />
        <el-table-column label="库存数量" align="center" prop="quantity" />
        <el-table-column label="上限数量" align="center" prop="upQuality" />
        <el-table-column label="下限数量" align="center" prop="downQuality" />
        <el-table-column label="预警类型" align="center" prop="limitedStatus">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.limitedStatus == 0"
              type="success"
              size="mini"
              >正常</el-tag
            >
            <el-tag
              v-if="scope.row.limitedStatus == 1"
              type="warning"
              size="mini"
              >超过上限</el-tag
            >
            <el-tag
              v-if="scope.row.limitedStatus == 2"
              type="danger"
              size="mini"
              >不足下限</el-tag
            >
          </template>
        </el-table-column>
      </el-table>

      <pagination
        small
        layout="total,prev, pager, next"
        v-show="storageTotal > 0"
        :total="storageTotal"
        :page.sync="storageParams.pageNum"
        :limit.sync="storageParams.pageSize"
        @pagination="getStorageCount"
      />
    </el-card>

    <el-card style="margin-top: 10px" shadow="hover">
      <div slot="header" class="clearfix">
        <span>临期预警</span>
        <el-button
          style="float: right; padding: 3px 0"
          icon="el-icon-refresh-left"
          size="mini"
          type="text"
          @click="getStorageAdvents"
        ></el-button>
      </div>

      <el-table
        v-loading="storageAdventsLoading"
        :data="storageAdventsList"
        size="mini"
      >
        <el-table-column label="物料编码" align="center" prop="itemCode" />
        <el-table-column label="物料名称" align="center" prop="itemName" />
        <el-table-column label="物料批次" align="center" prop="batchNo" />
        <el-table-column label="规格型号" align="center" prop="spec" />
        <el-table-column label="单位" align="center" prop="unit" />
        <el-table-column label="数量" align="center" prop="quantity" />
        <el-table-column label="生产日期" align="center" prop="produceDate">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.produceDate, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="过期时间" align="center" prop="expireDate">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.expireDate, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预警天数" align="center" prop="remindDay">
          <template slot-scope="scope">
            <span v-if="scope.row.remindDay == 0">-</span>
            <span v-else>{{ scope.row.remindDay }}天</span>
          </template>
        </el-table-column>
        <el-table-column label="预警类型" align="center" prop="shelfLifeStatus">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.shelfLifeStatus == 1"
              type="warning"
              size="mini"
              >临期</el-tag
            >
            <el-tag
              v-if="scope.row.shelfLifeStatus == 2"
              type="danger"
              size="mini"
              >过期</el-tag
            >
            <el-tag
              v-if="scope.row.shelfLifeStatus == 0"
              type="success"
              size="mini"
              >正常</el-tag
            >
          </template>
        </el-table-column>
      </el-table>

      <pagination
        small
        layout="total,prev, pager, next"
        v-show="storageAdventsTotal > 0"
        :total="storageAdventsTotal"
        :page.sync="storageAdventsParams.pageNum"
        :limit.sync="storageAdventsParams.pageSize"
        @pagination="getStorageAdvents"
      />
    </el-card>
  </div>
</template>

<script>
import { listWmsReceiveNotice } from "@/api/warehouse/receiveNotice";
import { listDeliveryNotice } from "@/api/warehouse/deliveryNotice";
import { getStorageCount } from "@/api/warehouse/itemStorage";
import { selectStorageAlertList } from "@/api/warehouse/itemStorageDetail";
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数
export default {
  dicts: [
    "recive_notice_status",
    "receive_type",
    "business_type_receive",
    "business_type_delivery",
    "delivery_notice_status",
    "delivery_type",
  ],
  name: "Index",
  data() {
    return {
      // 遮罩层
      receiveLoading: true,
      // 查询参数
      receiveParams: {
        pageNum: 1,
        pageSize: 5,
        statusArr: [0, 1],
      },
      // 总条数
      receiveTotal: 0,
      receiveList: [],

      // 遮罩层
      deliveryLoading: true,
      // 查询参数
      deliveryParams: {
        pageNum: 1,
        pageSize: 5,
        statusArr: [0, 1, 5],
      },
      // 总条数
      deliveryTotal: 0,
      deliveryList: [],

      // 遮罩层
      storageLoading: true,
      // 查询参数
      storageParams: {
        pageNum: 1,
        pageSize: 5,
      },
      // 总条数
      storageTotal: 0,
      storageList: [],

      // 遮罩层
      storageAdventsLoading: true,
      // 查询参数
      storageAdventsParams: {
        pageNum: 1,
        pageSize: 5,
      },
      // 总条数
      storageAdventsTotal: 0,
      storageAdventsList: [],
    };
  },
  created() {
    if (checkPermi(["warehouse:deliveryNotice:list"])) {
      this.getDeliveryList();
    }
    if (checkPermi(["warehouse:receiveNotice:list"])) {
      this.getReceiveList();
    }
    this.getStorageCount();
    this.getStorageAdvents();
  },
  methods: {
    checkPermi,
    checkRole,
    /** 查询入库通知列表 */
    getReceiveList() {
      this.receiveLoading = true;
      listWmsReceiveNotice(this.receiveParams).then((response) => {
        this.receiveList = response.rows;
        this.receiveTotal = response.total;
        this.receiveLoading = false;
      });
    },
    /** 查询出库通知列表 */
    getDeliveryList() {
      this.deliveryLoading = true;
      listDeliveryNotice(this.deliveryParams).then((response) => {
        this.deliveryList = response.rows;
        this.deliveryTotal = response.total;
        this.deliveryLoading = false;
      });
    },
    getStorageCount() {
      this.storageLoading = true;
      getStorageCount(this.storageParams).then((response) => {
        this.storageList = response.rows;
        this.storageTotal = response.total;
        this.storageLoading = false;
      });
    },
    getStorageAdvents() {
      this.storageAdventsLoading = true;
      selectStorageAlertList(this.storageAdventsParams).then((response) => {
        this.storageAdventsList = response.rows;
        this.storageAdventsTotal = response.total;
        this.storageAdventsLoading = false;
      });
    },
    gotoReceiveNotice() {
      this.$router.push({
        path: "/inboundManagement/receiptManager/receiveNotice",
      });
    },
    gotoDeliveryNotice() {
      this.$router.push({
        path: "outboundManagement/outboundNotice/deliveryNotice",
      });
    },
  },
};
</script>
