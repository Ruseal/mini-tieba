<template>
  <div class="user-card">
    <div class="wrapper">
      <van-cell class="card-title" title="创作中心" :border="false" is-link />
      <van-grid :column-num="creationList.lenth" :border="false">
        <van-grid-item v-for="(value, index) in creationList" :key="index">
          <img class="card-img" slot="icon" :src="value.image" />
          <div class="card-text" slot="text">{{ value.name }}</div>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      creationList: [
        {
          name: "我的帖子",
          image: require("@/assets/img/user/user-card/myarticle.png"),
        },
        {
          name: "大神认证",
          image: require("@/assets/img/user/user-card/certification.png"),
        },
        {
          name: "创作学院",
          image: require("@/assets/img/user/user-card/creation.png"),
        },
        {
          name: "热门活动",
          image: require("@/assets/img/user/user-card/hotactive.png"),
        },
      ],
    };
  },
};
</script>
<style lang='less' scoped>
.user-card {
  margin-top: 20px;
  .wrapper {
    width: 92vw;
    margin: 0 auto;
    border-radius: 10px;
    box-shadow: 0 0 15px 5px #eaf6fd;
    .card-title {
      font-size: 16px;
      font-weight: 600;
    }
    .card-img {
      width: 55px;
      height: 55px;
    }
    .card-text {
      font-size: 10px;
    }
  }
}
</style>