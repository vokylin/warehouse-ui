<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="100px"
    >
      <el-form-item label="仓库" prop="warehouseId">
        <el-select
          v-model="queryParams.warehouseId"
          placeholder="请选择仓库"
          clearable
          size="mini"
          @change="getList"
        >
          <el-option
            v-for="item in warehouseList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物料编码" prop="itemCode">
        <el-input
          v-model="queryParams.itemCode"
          placeholder="请输入物料编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料名称" prop="itemName">
        <el-input
          v-model="queryParams.itemName"
          placeholder="请输入物料名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关联业务ID" prop="relateId">
        <el-input
          v-model="queryParams.relateId"
          placeholder="请输入关联业务ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="库存状态" prop="storageStatus">
        <el-select
          v-model="queryParams.storageStatus"
          placeholder="请选择库存状态"
          clearable
          size="mini"
          @change="handleQuery"
        >
          <el-option
            v-for="item in dict.type.storage_status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="作业状态" prop="workStatus">
        <el-select
          v-model="queryParams.workStatus"
          placeholder="请选择作业状态"
          clearable
          size="mini"
          @change="handleQuery"
        >
          <el-option
            v-for="item in dict.type.work_status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-edit"
          size="mini"
          @click="handleInfoEdit"
          :disabled="multiple"
          v-hasPermi="['warehouse:itemStorage:infoEdit']"
          >信息调整</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-edit"
          size="mini"
          @click="handleStatusEdit"
          :disabled="multiple"
          v-hasPermi="['warehouse:itemStorage:statusEdit']"
          >状态调整</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-search"
          size="mini"
          @click="handleUnitConversion"
          :disabled="multiple"
          v-hasPermi="['warehouse:itemStorage:unitConversion']"
          >单位换算</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="handleDisplacement"
          v-hasPermi="['warehouse:itemStorageDetail:displacement']"
          >移位</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-files"
          size="mini"
          @click="handleAllocate"
          v-hasPermi="['warehouse:itemStorageDetail:allocate']"
          >调拨</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['warehouse:itemStorage:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>
    <!--       @select="select"
      @select-all="selectAll" -->
    <el-table
      v-loading="loading"
      :data="itemStorageList"
      :select-on-indeterminate="false"
      @selection-change="handleSelectionChange"
      row-key="id"
      ref="table"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="仓库" width="180" prop="warehouseName" />
      <el-table-column
        label="物料编码"
        width="180"
        align="center"
        prop="itemCode"
      />
      <el-table-column
        label="物料名称"
        width="260"
        align="center"
        prop="itemName"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="数量" align="center" prop="quantity">
        <template slot-scope="scope">
          <span>{{ scope.row.quantity }}</span>
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
          <!-- <img
            v-if="scope.row.limitedStatus == 1"
            src="../../../assets/images/limitMax.png"
            alt=""
            style="width: 40px; height: 40px;"
          />
          <img
            v-if="scope.row.limitedStatus == 2"
            src="../../../assets/images/limitMin.png"
            alt=""
            style="width: 40px; height: 40px"
          /> -->
          <!-- <el-tag v-if="scope.row.limitedStatus == 1" type="danger" size="mini"
            >超过上限</el-tag
          >
          <el-tag v-if="scope.row.limitedStatus == 2" type="danger" size="mini"
            >不足下限</el-tag
          > -->
        </template>
      </el-table-column>
      <el-table-column
        label="物料单位"
        width="80"
        align="center"
        prop="unit"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="规格型号"
        width="80"
        align="center"
        prop="spec"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="实时单价"
        align="center"
        width="120"
        prop="actualPrice"
      />
      <el-table-column
        label="库存金额"
        align="center"
        width="120"
        prop="storagePrice"
      >
        <template slot-scope="scope">
          {{ scope.row.storagePrice && scope.row.storagePrice.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column
        label="物料批号"
        align="center"
        width="180"
        prop="batchNo"
      />
      <el-table-column
        label="货位"
        width="120"
        align="center"
        prop="locationName"
      />
      <el-table-column label="库存状态" align="center" prop="storageStatus">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.storage_status"
            :value="scope.row.storageStatus"
          />
        </template>
      </el-table-column>
      <el-table-column label="作业状态" align="center" prop="workStatus">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.work_status"
            :value="scope.row.workStatus"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="关联业务类型"
        width="180"
        align="center"
        prop="relateType"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.relate_type"
            :value="scope.row.relateType"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="关联业务ID"
        width="180"
        align="center"
        prop="relateId"
      />

      <el-table-column
        label="生产日期"
        align="center"
        prop="productDate"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.productDate, "{y}-{m}-{d}") }}</span>
          <!-- <img
            v-if="scope.row.isAdvent == 1"
            src="../../../assets/images/expire.png"
            alt=""
            style="width: 35px; height: 35px"
          />
          <img
            v-if="scope.row.isAdvent == 1"
            src="../../../assets/images/expire.png"
            alt=""
            style="width: 35px; height: 35px"
          /> -->
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
      <!-- <el-table-column label="温层" align="center" prop="thermosphere">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.thermosphere"
            :value="scope.row.thermosphere"
          />
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item
          label="生产日期"
          prop="productDate"
          v-if="!form.isStatusEdit"
        >
          <el-date-picker
            clearable
            v-model="form.productDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择生产日期"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="过期日期"
          prop="expireDate"
          v-if="!form.isStatusEdit"
        >
          <el-date-picker
            clearable
            v-model="form.expireDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择过期日期"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="库存状态" prop="storageStatus">
          <el-select
            v-model="form.storageStatus"
            placeholder="请选择库存状态"
            style="width: 100%"
          >
            <el-option
              v-for="item in dict.type.storage_status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="生产批次" prop="batchNo" v-if="!form.isStatusEdit">
          <el-input v-model="form.batchNo" placeholder="请输入生产批次" />
        </el-form-item>
        <el-form-item label="数量" prop="quantity" v-if="!form.isStatusEdit">
          <el-input v-model="form.quantity" placeholder="请输入数量" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 详情对话框 -->
    <detail ref="detail"></detail>
    <displacement ref="displacement"></displacement>
    <allocate ref="allocate"></allocate>
    <doseUnit ref="doseUnit"></doseUnit>
  </div>
</template>

<script>
import { listItemStorage } from "@/api/warehouse/itemStorage";
import { updateItemStorageDetail } from "@/api/warehouse/itemStorageDetail";
import detail from "./components/detail";
import displacement from "./components/displacement";
import allocate from "./components/allocate";
import doseUnit from "./components/doseUnit";
import { getWarehouseList } from "@/api/system/warehouse";
export default {
  dicts: ["storage_status", "work_status", "thermosphere", "relate_type"],
  name: "ItemStorage",
  components: { detail, displacement, allocate, doseUnit },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 库存汇总表格数据
      itemStorageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyId: null,
        warehouseId: null,
        itemCode: null,
        itemName: null,
        quantity: null,
        actualPrice: null,
        relateId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      selectData: [],
      // 仓库下拉框数据
      warehouseList: [],
    };
  },
  created() {
    this.getList();
    this.getWarehouseList();
  },
  methods: {
    /** 查询库存汇总列表 */
    getList() {
      this.loading = true;
      listItemStorage(this.queryParams).then((response) => {
        this.itemStorageList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 获取仓库下拉框数据 */
    getWarehouseList() {
      getWarehouseList().then((response) => {
        this.warehouseList = response.data;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        storageStatus: null,
        workStatus: null,
        relateType: null,
        batchNo: null,
        quantity: null,
        productDate: null,
        expireDate: null,
        isStatusEdit: false,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 修改按钮操作 */
    handleInfoEdit() {
      this.reset();
      if (this.selectData.length > 1) {
        this.$modal.msgError("只能选择一条数据");
        return;
      }
      if (this.selectData[0].companyId) {
        this.$modal.msgError("只能选择库存详情数据");
        return;
      }
      var rowData = this.selectData[0];
      this.form.id = rowData.id;
      this.form.storageStatus = rowData.storageStatus + "";
      this.form.workStatus = rowData.workStatus + "";
      this.form.relateType = rowData.relateType + "";
      this.form.batchNo = rowData.batchNo;
      this.form.quantity = rowData.quantity;
      this.form.productDate = rowData.productDate;
      this.form.expireDate = rowData.expireDate;
      this.title = "信息调整";
      this.open = true;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (!this.form.isStatusEdit) {
            if (this.form.productDate > this.form.expireDate) {
              this.$modal.msgError("生产日期不能大于失效日期");
              return;
            }
            if (this.form.quantity <= 0) {
              this.$modal.msgError("数量不能小于等于0");
              return;
            }
          }

          updateItemStorageDetail(this.form).then((response) => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },

    /** 状态调整 */
    handleStatusEdit() {
      this.reset();
      if (this.selectData.length > 1) {
        this.$modal.msgError("只能选择一条数据");
        return;
      }
      if (this.selectData[0].companyId) {
        this.$modal.msgError("只能选择库存详情数据");
        return;
      }
      var rowData = this.selectData[0];
      this.form.id = rowData.id;
      this.form.storageStatus = rowData.storageStatus + "";
      this.form.isStatusEdit = true;
      this.title = "状态调整";
      this.open = true;
    },

    /** 移位按钮 */
    handleDisplacement() {
      this.$refs.displacement.start();
    },

    /** 调拨 */
    handleAllocate() {
      this.$refs.allocate.start();
    },

    // 查看单位换算按钮
    handleUnitConversion() {
      const id = this.ids;
      var rowData = this.selectData[0];
      this.$refs.doseUnit.getList(rowData);
    },

    // 选择事件
    handleSelectionChange(selection) {
      this.selectData = selection;
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download('warehouse/itemStorage/export', {
        ...this.queryParams
      }, `库存数据_${new Date().getTime()}.xlsx`)
    }

    // toggleSelection(row, select) {
    //   if (row) {
    //     this.$nextTick(() => {
    //       this.$refs.table && this.$refs.table.toggleRowSelection(row, select);
    //     });
    //   }
    // },
    // cancelAll() {
    //   this.$refs.table.clearSelection();
    // },

    // select(selection, row) {
    //   if (
    //     selection.some((el) => {
    //       return row.id === el.id;
    //     })
    //   ) {
    //     if (row.children) {
    //       row.children.map((j) => {
    //         this.toggleSelection(j, true);
    //       });
    //     }
    //   } else {
    //     if (row.children) {
    //       row.children.map((j) => {
    //         this.toggleSelection(j, false);
    //       });
    //     }
    //   }
    // },
    // selectAll(selection) {
    //   // tabledata第一层只要有在selection里面就是全选
    //   const isSelect = selection.some((el) => {
    //     const tableDataIds = this.tableData.map((j) => j.id);
    //     return tableDataIds.includes(el.id);
    //   });
    //   // tableDate第一层只要有不在selection里面就是全不选
    //   const isCancel = !this.tableData.every((el) => {
    //     const selectIds = selection.map((j) => j.id);
    //     return selectIds.includes(el.id);
    //   });
    //   if (isSelect) {
    //     selection.map((el) => {
    //       if (el.children) {
    //         el.children.map((j) => {
    //           this.toggleSelection(j, true);
    //         });
    //       }
    //     });
    //   }
    //   if (isCancel) {
    //     this.tableData.map((el) => {
    //       if (el.children) {
    //         el.children.map((j) => {
    //           this.toggleSelection(j, false);
    //         });
    //       }
    //     });
    //   }
    // },
  },
};
</script>
