<template>
  <div class="card-list">
    <div class="card-title">最近逛的吧</div>
    <scroll class="scroll" ref="colScrollRef" scrollX>
      <slot></slot>
    </scroll>
  </div>
</template>

<script>
import Scroll from "../../common/Scroll.vue";
export default {
  name: "",
  components: { Scroll },
  data() {
    return {
      colScrollRef: null,
    };
  },
  mounted() {
    this.colScrollRef = this.$refs.colScrollRef;
  },
};
</script>
<style lang='less' scoped>
.card-list {
  width: 100vw;
  margin-top: 12px;
  margin-left: -10px;
  .card-title {
    font-size: 15px;
    font-weight: 700;
    padding-left: 10px;
    letter-spacing: 1px;
  }
  .scroll {
    width: 100%;
    height: 140px;
    margin-top: 12px;
    /deep/ .content {
      display: inline-block;
    }
  }
}
</style>