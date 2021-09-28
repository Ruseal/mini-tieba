<template>
  <div class="error">
    <img
      class="error-img"
      src="@/assets/img/common/page-img/error.png"
      alt=""
    />
    <div class="error-net">网络好像出了点问题(-1)</div>
    <div @click="freshPage" class="button">戳这重试</div>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {};
  },
  methods:{
    freshPage(){
      this.$emit('fresh-page')
    }
  }
};
</script>
<style lang='less' scoped>
.error {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  .error-img {
    width: 180px;
    height: 180px;
    margin-top: 60%;
    margin-left: 50%;
    transform: translate(-50%, -50%);
  }
  .error-net{
    font-size: 10px;
    text-align: center;
    margin-top: -130px;
  }
  .button{
    width: 150px;
    height: 30px;
    margin-left: 50%;
    margin-top: 5%;
    transform: translateX( -50%);
    border-radius: 40px;
    text-align: center;
    line-height: 30px;
    color: white;
    font-size: 13px;
    letter-spacing: 2px;
    background-color: rgb(138, 175, 255);
  }
}
</style>