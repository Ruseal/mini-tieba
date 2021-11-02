<template>
  <div class="notice">
    <notice-nav />
    <scroll class="scroll" click>
      <van-grid :gutter="10" :border="false">
        <van-grid-item
          @click="toRouter(index)"
          v-for="(item, index) in gridImgList"
          :key="index"
          :icon="item.icon"
          :text="item.text"
        />
      </van-grid>
    </scroll>
  </div>
</template>

<script>
import Scroll from "../../../components/common/Scroll.vue";
import NoticeNav from "../../../components/content/notice/NoticeNav.vue";
export default {
  components: { NoticeNav, Scroll },
  name: "",
  data() {
    return {
      gridImgList: [
        { icon: require("@/assets/img/notice/my.png"), text: "@我的" },
        { icon: require("@/assets/img/notice/mylike.png"), text: "点赞" },
        { icon: require("@/assets/img/notice/myreply.png"), text: "回复" },
        { icon: require("@/assets/img/notice/myfuns.png"), text: "粉丝" },
      ],
    };
  },
  methods: {
    toRouter(index) {
      switch (index) {
        case 0:
          this.$router.push({ name: "outher", params: { title: "@我的" } });
          break;
        case 1:
          this.$router.push({ name: "outher", params: { title: "点赞" } });
          break;
        case 2:
          this.$router.push("/reply");
          break;
        default:
          console.log("ll");
      }
    },
  },
};
</script>
<style lang='less' scoped>
.notice {
  .scroll {
    width: 100vw;
    height: calc(100vh - 46px - 50px);
    /deep/ .van-icon__image {
      width: 40px;
      height: 40px;
    }
    /deep/ .van-grid-item__text {
      font-size: 13px;
    }
  }
}
</style>