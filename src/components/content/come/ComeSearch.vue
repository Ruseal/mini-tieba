<template>
  <div class="come-search">
    <van-search
      class="search"
      v-model="value"
      placeholder="请输入搜索关键词"
      shape="round"
      readonly
    />
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      value:'大家都在搜:'
    };
  },
};
</script>
<style lang='less' scoped>
.come-search {
  .search {
    height: 44px;
    width: 100%;
    margin: 0 auto;
  }
  .van-search__content {
    background-color: #f3f4f6;
    /deep/ .van-icon {
      margin-top: 2px;
      color: rgb(90, 90, 90);
    }
    /deep/ .van-field__control {
      margin-top: 2px;
      font-size: 14px;
      color: rgb(184, 181, 181);
    }
  }
}
</style>