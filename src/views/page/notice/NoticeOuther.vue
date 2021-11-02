<template>
  <div class="notice-outher">
    <van-nav-bar :title="$route.params.title">
      <left-arrow slot="left" @click.native="$router.back()" />
    </van-nav-bar>
    <div class="nothing">暂无此队列</div>
  </div>
</template>

<script>
import LeftArrow from "@/components/common/LeftArrow.vue";
export default {
  name: "",
  components: { LeftArrow },
};
</script>
<style lang='less' scoped>
.notice-outher {
  /deep/ .van-nav-bar__title {
    font-size: 14px;
  }
  .nothing{
    margin-top: 15px;
    text-align: center;
    font-size: 13px;
    color: rgb(145, 145, 145);
  }
}
</style>