<template>
  <div class="user-swipe">
    <van-swipe class="user-swipe-wrapper" :autoplay="5000">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img class="user-swipe-img" v-lazy="image" />
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      images: [
        require("@/assets/img/user/user-swipe/swipe1.jpg"),
        require("@/assets/img/user/user-swipe/swipe2.jpg"),
      ],
    };
  },
};
</script>
<style lang='less' scoped>
.user-swipe {
  margin-top: 20px;
  .user-swipe-wrapper {
    width: 92vw;
    height: 60px;
    margin: 0 auto;
    border-radius: 10px;
    .user-swipe-img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>