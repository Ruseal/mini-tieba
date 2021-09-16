<template>
  <div class="set-nav">
    <van-nav-bar title="设置" @click-left="onClickLeft"> 
      <div slot="left"><left-arrow/></div>
    </van-nav-bar>
  </div>
</template>

<script>
import LeftArrow from '../../common/LeftArrow.vue';
export default {
  name: "set-nav",
  components: {LeftArrow},
  data() {
    return {};
  },
  methods: {
    onClickLeft() {
      this.$router.back();
    },
  },
};
</script>
<style lang='less' scoped>
</style>