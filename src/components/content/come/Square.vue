<template>
  <div class="square">
    <img src="../../../assets/img/come/app_utils.png" alt="" />
    <div>
      <div>吧广场</div>
      <div>快戳这里，这有很多你感兴趣的吧</div>
    </div>
    <left-arrow class="arrow" />
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
};
</script>
<style lang='less' scoped>
.square {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  border-radius: 30px;
  background-color: rgb(240, 246, 248);
  margin: 15px auto;
  img {
    width: 48px;
    height: 45px;
    margin: 0 20px 0 15px;
  }
  div {
    div:nth-child(1) {
      font-size: 16px;
      font-weight: 500;
    }
    div:nth-child(2) {
      font-size: 12px;
      color: rgb(168, 165, 165);
    }
  }
  .arrow {
    position: absolute;
    width: 9px;
    height: 9px;
    transform: rotate(135deg);
    right: 20px;
    border-top: 2px solid rgb(182, 181, 181);
    border-left: 2px solid rgb(182, 181, 181);
  }
}
</style>