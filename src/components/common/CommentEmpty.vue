<template>
  <div class="comment-empty">
    <div class="nav">
      <left-arrow @click.native="$router.back()" class="arrow" />
      <div>{{ $route.query.name}}</div>
      <div></div>
    </div>
  </div>
</template>

<script>
import LeftArrow from "./LeftArrow.vue";
export default {
  name: "",
  components: { LeftArrow },
  data() {
    return {};
  },
};
</script>
<style lang='less' scoped>
.comment-empty {
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 46px;
    .arrow {
      margin-left: 10px;
    }
  }
}
</style>