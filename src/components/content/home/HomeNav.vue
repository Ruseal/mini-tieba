<template>
  <div class="home-nav">
    <van-nav-bar class="nav" left-arrow>
      <div slot="left">
        <van-search
          class="search"
          v-model="value"
          placeholder="请输入搜索关键词"
          shape="round"
          readonly
        />
      </div>
      <div slot="right" class="nav-right">
        <img src="@/assets/img/home/redpackage.png" alt="" />
        <img src="@/assets/img/home/release.png" alt="" />
      </div>
    </van-nav-bar>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      value: "大家都在搜:A15处理器",
    };
  },
};
</script>
<style lang='less' scoped>
.home-nav {
  position: relative;
  height: 46px;
  .nav {
    .search {
      height: 46px;
      width: 250px;
      margin-left: -15px;
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
    .nav-right {
      display: flex;
      img:nth-child(1) {
        width: 40px;
        height: 40px;
      }
      img:nth-child(2) {
        margin-right: -10px;
        width: 80px;
        height: 40px;
      }
    }
  }
}
</style>