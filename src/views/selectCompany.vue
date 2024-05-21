<template>
  <div class="body">

    <el-container>
      <el-header><h1 class="title">请选择公司</h1></el-header>
      <el-main>
        <div class="box">
          <div class="head-container" style="width: 100%">
            <el-input
              v-model="companyName"
              placeholder="请输入公司名称"
              clearable
              size="small"
              prefix-icon="el-icon-search"
              style="margin-bottom: 20px"
            />
          </div>
          <div class="head-container" style="width: 100%">
            <el-tree

              :data="companies"
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="tree"
              node-key="id"
              default-expand-all
              highlight-current
              @node-click="handleNodeClick"
            />
          </div>
        </div>
      </el-main>
      <el-footer></el-footer>
    </el-container>

    <!--    <div class="page">-->
    <!--      <div>-->


    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getWarehouseByCompanyId } from '@/api/system/warehouse'

export default {
  name: 'selectCompany',
  components: {
    Treeselect
  },
  data() {
    return {
      count: 0,
      companies: [],
      itemHeight: 80,
      boxHeight: 0,
      companyName: undefined,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.companies = this.$store.getters.companies
  },
  watch: {
    // 监听公司名称
    companyName(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.goIndex(data.id)
    },

    // 获取公司下的仓库
    getWarehouse(companyId) {
      getWarehouseByCompanyId(companyId).then(response => {
        this.$store.commit('SET_WAREHOUSES', response.data)
      })
    },

    // 跳转到首页
    goIndex(id) {
      // 将选中的公司ID存入 vuex store
      this.$store.commit('SET_COMPANY_ID', id)
      // 获取公司下的仓库
      this.getWarehouse(id)
      this.$router.push('/index')

    }
  }
}
</script>

<style scoped>

.el-main{
  display: flex;
  justify-content: center;
  align-items: center;
}

.box {
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  height: auto;
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  padding: 20px;
  margin-top: 50px;
}

.title {
  margin-top: 50px;
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}
</style>
