<template>
  <div class="nav">
    <div><left-arrow class="arrow" @click.native="$router.back()"/></div>
    <div>
      <img src="@/assets/img/common/tieba-avatar/search.png" alt="" />
      <img src="@/assets/img/common/tieba-avatar/bell.png" alt="" />
      <img src="@/assets/img/common/tieba-avatar/share.png" alt="" />
    </div>
  </div>
</template>

<script>
import LeftArrow from "../../common/LeftArrow.vue";
export default {
  name: "",
  components: { LeftArrow },
  data() {
    return {};
  },
  methods:{
  }
};
</script>
<style lang='less' scoped>
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 46px;
  padding: 0 10px;
  .arrow {
    border-top: 2px solid rgb(255, 255, 255);
    border-left: 2px solid rgb(255, 255, 255);
  }
  div {
    display: flex;
    img {
      margin-left: 20px;
      width: 22px;
      height: 22px;
    }
  }
}
</style>