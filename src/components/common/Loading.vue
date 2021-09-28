<template>
  <div class="loading">
    <img
      class="page-loading"
      src="@/assets/img/common/page-img/page_loading.gif"
      alt=""
    />
    <div>努力加载中...</div>
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
.loading {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  .page-loading {
    width: 80px;
    height: 80px;
    margin-top: 60%;
    margin-left: 50%;
    transform: translate(-50%, -50%);
  }
  div{
    text-align: center;
    margin-top: -20px;
  }
}
</style>