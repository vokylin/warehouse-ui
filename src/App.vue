<template>
  <div id="app">
    <router-view />
    <theme-picker />
  </div>
</template>

<script>
import ThemePicker from "@/components/ThemePicker";

export default {
  name: "App",
  components: { ThemePicker },
    metaInfo() {
        return {
            title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
            titleTemplate: title => {
                return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
            }
        }
    },
    created() {
      // 在页面加载时读取sessionStorage里的状态信息
      if (sessionStorage.getItem('companyId')) {
        this.$store.commit('SET_COMPANY_ID', sessionStorage.getItem('companyId'))
      }
      if (sessionStorage.getItem("warehouses")) {
        this.$store.commit('SET_WAREHOUSES', JSON.parse(sessionStorage.getItem("warehouses")))
      }

      // 在页面刷新时将vuex里的信息保存到sessionStorage里
      // beforeunload事件在页面刷新时先触发
      window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('companyId',this.$store.getters.companyId)
        sessionStorage.setItem('warehouses',JSON.stringify(this.$store.getters.warehouses))
      })
    }
};
</script>
<style scoped>
#app .theme-picker {
  display: none;
}
</style>
