<template>
  <div class="notice-nav">
    <van-nav-bar title="消息">
      <img class="img" slot="right" src="@/assets/img/notice/addnotice.png"/>
    </van-nav-bar>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {};
  },
};
</script>
<style lang='less' scoped>
.notice-nav{
  .img{
    width: 21px;
    height: 20px;
  }
}
</style>