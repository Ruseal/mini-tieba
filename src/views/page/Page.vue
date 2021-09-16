<template>
  <div class="page">
    <keep-alive include="home">
      <router-view />
    </keep-alive>
    <tab-bar />
  </div>
</template>

<script>
import TabBar from "@/components/common/TabBar.vue";
export default {
  name: "page",
  components: { TabBar },
  data() {
    return {};
  },
};
</script>
<style lang='less' scoped>
</style>