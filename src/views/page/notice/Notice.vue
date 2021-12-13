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
          :badge="item.badge || ''"
        />
      </van-grid>
    </scroll>
  </div>
</template>

<script>
import { getUserMessage } from "@/api/user-net";
import { getBadge } from "@/api/api-net";
import Scroll from "@/components/common/Scroll.vue";
import NoticeNav from "@/components/content/notice/NoticeNav.vue";
export default {
  components: { NoticeNav, Scroll },
  name: "notice",
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
  created() {
    this.$bus.$on("clear-badge", this.getBadgeMethod);
    this.getBadgeMethod();
  },
  destroyed() {
    this.$bus.$off("clear-badge", this.getBadgeMethod);
  },
  methods: {
    async getBadgeMethod() {
      try {
        const { status, data } = await getBadge();
        if (status === 401) return;
        if (status !== 200) throw new Error();
        if (!data) return;
        this.$set(this.gridImgList[2], "badge", data.reply || "");
        this.$set(this.gridImgList[3], "badge", data.focus || "");
        this.$bus.$emit("badge", data);
      } catch (err) {
        this.$toast.fail("网络错误");
      }
    },
    async toRouter(index) {
      switch (index) {
        case 0:
          this.$router.push({ name: "outher", params: { title: "@我的" } });
          break;
        case 1:
          this.$router.push({ name: "outher", params: { title: "点赞" } });
          break;
        case 2:
          this.$router.push({ name: "reply"});
          break;
        case 3:
          const result = await this.getUserMessageMethod();
          if (!result) {
            break;
          }
          this.$router.push({
            name: "user-type-list",
            query: {
              type: "fans",
              userId: result,
              isSelf: true,
            },
          });
          break;
        default:
      }
    },
    async getUserMessageMethod() {
      try {
        const { data } = await getUserMessage();
        return data.id;
      } catch (err) {
        this.$toast.fail("网络错误");
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