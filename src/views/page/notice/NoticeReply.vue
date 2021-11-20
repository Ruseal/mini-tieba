<template>
  <div class="notice-reply">
    <van-nav-bar title="回复">
      <left-arrow slot="left" @click.native="$router.back()" />
    </van-nav-bar>
    <scroll class="scroll" click ref="scroll">
      <loading v-if="statusData === 'loading'" />
      <error v-else-if="statusData === 'error'" />
      <reply-wrapper
        v-else
        v-for="item in replyUserList"
        :key="item.id"
        :reply-data="item"
      >
        <user-label
          slot="label"
          :user-label="{
            avatar: item.author.avatar,
            title: item.author.name,
            createTime: item.createTime,
          }"
          :label-type="['time']"
          avatar-type="round"
        />
      </reply-wrapper>
    </scroll>
  </div>
</template>

<script>
import { getUserReply } from "../../../api/api-net";

import LeftArrow from "@/components/common/LeftArrow.vue";
import Scroll from "@/components/common/Scroll.vue";
import ReplyWrapper from "../../../components/content/notice/ReplyWrapper.vue";
import UserLabel from "../../../components/common/UserLabel.vue";
import Error from "../../../components/common/Error.vue";
import Loading from "../../../components/common/Loading.vue";
export default {
  name: "",
  components: { LeftArrow, Scroll, ReplyWrapper, UserLabel, Error, Loading },
  data() {
    return {
      statusData: "loading",
      replyUserList: null,
    };
  },
  created() {
    this.getUserReplyMethod();
  },
  methods: {
    async getUserReplyMethod() {
      try {
        const { data, status } = await getUserReply();
        if (status !== 200) throw new Error();
        this.statusData = "ok";
        this.replyUserList = data;
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      } catch (error) {
        this.statusData = "error";
      }
    },
  },
};
</script>
<style lang='less' scoped>
.notice-reply {
  /deep/ .van-nav-bar__title {
    font-size: 14px;
  }
  .scroll {
    width: 100vw;
    height: calc(100vh - 46px);
    background-color: rgb(248, 248, 248);
  }
}
</style>