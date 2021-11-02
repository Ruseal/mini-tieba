<template>
  <div class="user">
    <loading v-if="dataStatus === 'loadding'" />
    <error @fresh-page="freshPage" v-else-if="dataStatus === 'error'" />
    <div v-else>
      <user-nav />
      <scroll class="scroll" click :bounce="false">
        <user-message
          :user-message="userMessage"
          @click.native="toUserDetail"
        />
        <user-numerical :numerical="userMessage.numerical" />
        <user-card />
        <user-swipe />
        <user-cell :cell-list="queryCellList" lastLine />
        <user-cell :cell-list="businessCellList" lastLine />
        <user-cell :cell-list="otherCellList" />
      </scroll>
    </div>
  </div>
</template>

<script>
import { getUserMessage } from "@/api/user-net.js";

import * as Constant from "@/constant/store-constant";

import UserNav from "@/components/content/user/UserNav.vue";
import Scroll from "@/components/common/Scroll.vue";
import UserMessage from "@/components/content/user/UserMessage.vue";
import UserNumerical from "@/components/content/user/UserNumerical.vue";
import UserCard from "@/components/content/user/UserCard.vue";
import UserSwipe from "@/components/content/user/UserSwipe.vue";
import UserCell from "@/components/content/user/UserCell.vue";
import Loading from "../../../components/common/Loading.vue";
import Error from "../../../components/common/Error.vue";

export default {
  name: "user",
  components: {
    UserNav,
    Scroll,
    UserMessage,
    UserNumerical,
    UserCard,
    UserSwipe,
    UserCell,
    Loading,
    Error,
  },
  data() {
    return {
      userMessage: null,
      dataStatus: "loadding",
      queryCellList: [
        {
          title: "我的收藏",
          image: require("@/assets/img/user/user-cell/collection.png"),
        },
        {
          title: "浏览历史",
          image: require("@/assets/img/user/user-cell/history.png"),
        },
      ],
      businessCellList: [
        {
          title: "游戏中心",
          image: require("@/assets/img/user/user-cell/game.png"),
        },
        {
          title: "会员中心",
          image: require("@/assets/img/user/user-cell/member_center.png"),
        },
        {
          title: "服务中心",
          image: require("@/assets/img/user/user-cell/service.png"),
        },
      ],
      otherCellList: [
        {
          title: "帮助",
          image: require("@/assets/img/user/user-cell/help.png"),
        },
        {
          title: "更多",
          image: require("@/assets/img/user/user-cell/more.png"),
        },
      ],
    };
  },
  mounted() {
    this.getUserMessageMethod();
  },
  methods: {
    async getUserMessageMethod() {
      try {
        const { data, status } = await getUserMessage();
        if (status !== 200) throw new Error();
        this.userMessage = data;
        this.dataStatus = "ok";
        this.userMessage.avatar_url &&
          this.$store.dispatch(
            Constant.SAVE_USER_AVATAR,
            this.userMessage.avatar_url
          );
      } catch (err) {
        this.dataStatus = "error";
      }
    },
    freshPage() {
      this.dataStatus = "loadding";
      this.getUserMessageMethod();
    },
    toUserDetail() {
      this.$router.push({
        name: "user-detail",
        params: {
          selfUser: true,
          userId: this.userMessage.id,
        },
      });
    },
  },
};
</script>
<style lang='less' scoped>
.user {
  .scroll {
    height: calc(100vh - 46px - 52px);
  }
}
</style>