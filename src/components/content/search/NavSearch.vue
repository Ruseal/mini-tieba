<template>
  <div class="nav-search">
    <form action="/">
      <van-search
        v-model="value"
        show-action
        placeholder="请输入搜索关键词"
        shape="round"
        @search="onSearch"
        @cancel="$router.back()"
      />
    </form>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      value:'ss'
    };
  },
  methods:{
    onSearch(){
      console.log('点击搜索');
    }
  }
};
</script>
<style lang='less' scoped>
</style>