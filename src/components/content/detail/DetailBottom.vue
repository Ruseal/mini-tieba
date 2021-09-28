<template>
  <div class="detail-bottom">
    <div class="send" @click="onDetailTextarea">
      <div>
        <img :src="yourUserAvatarHandle" alt="" /><span>{{ isMsg }}</span>
      </div>
    </div>
    <div class="msg" @click="onDetailBottomComment">
      <img src="@/assets/img/detail/msg_and_text.png" alt="" />
      <span>{{ commentCountHandle }}</span>
    </div>
    <img @click="startHandle" :src="isStartHandle" alt="" />
    <img src="@/assets/img/detail/wx.png" alt="" />
  </div>
</template>

<script>
import { start, unstart } from "@/api/detail-net";
import statusHandle from "@/utils/status-handle";
import { mapState } from "vuex";
export default {
  name: "",
  components: {},
  data() {
    return {};
  },
  props: {
    detailData: {
      type: Object,
      defaulu() {
        return {};
      },
    },
  },
  computed: {
    ...mapState({
      commentMsg: "commentMsg",
    }),
    isMsg() {
      let item = this.commentMsg.find((item) => item.id === this.detailData.id);
      if (item && (item.message || item.fileList.length)) return "[草稿待发送]";
      return "我来评论";
    },
    commentCountHandle() {
      return this.detailData.commentCount
        ? this.detailData.commentCount
        : "抢沙发";
    },
    yourUserAvatarHandle() {
      let avatar = require("@/assets/img/common/user-avatar/b.jpg");
      if (this.detailData.yourUser) {
        if (this.detailData.yourUser.avatar) {
          avatar = this.detailData.yourUser.avatar;
        } else {
          avatar = require("@/assets/img/common/user-avatar/b.jpg");
        }
      }
      return avatar;
    },
    isStartHandle() {
      return this.detailData.isStart
        ? require("@/assets/img/detail/start_active.png")
        : require("@/assets/img/detail/start.png");
    },
  },
  mounted() {
    this.$bus.$on("sync-msg", this.syncMsg);
  },
  destroyed() {
    this.$bus.$off("sync-msg", this.syncMsg);
  },
  methods: {
    async startHandle() {
      let result = null;
      try {
        if (this.detailData.isStart) {
          const { status } = await unstart(this.detailData.id);
          result = statusHandle(status);
          if (!result.success) throw new Error();
          this.detailData.isStart = !this.detailData.isStart;
          this.$toast.success("取消收藏贴子");
        } else {
          const { status } = await start(this.detailData.id);
          result = statusHandle(status);
          if (!result.success) throw new Error();
          this.detailData.isStart = !this.detailData.isStart;
          this.$toast.success("已收藏贴子");
        }
      } catch (err) {
        this.$toast.fail("网络错误");
        result.message && this.$toast.fail(result.message);
      }
    },
    onDetailTextarea() {
      this.$bus.$emit("textarea-popup", null);
    },
    onDetailBottomComment() {
      this.$emit("to-top");
    },
    syncMsg(event) {
      if (this.detailData.id !== event.id) return;
      this.detailData.commentCount += event.count;
    },
  },
};
</script>
<style lang='less' scoped>
.detail-bottom {
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 40px;
  .send {
    width: 50%;
    height: 100%;
    padding: 5px 0 5px 10px;
    div {
      display: flex;
      align-items: center;
      height: 30px;
      border-radius: 20px;
      background-color: rgba(228, 227, 230, 0.671);
      img {
        width: 25px;
        height: 24px;
        margin-left: 5px;
        object-fit: cover;
        border-radius: 11px;
      }
      span {
        font-size: 13.5px;
        letter-spacing: 1px;
        color: rgb(160, 159, 159);
      }
    }
  }
  .msg {
    position: relative;
    span {
      position: absolute;
      display: block;
      font-size: 10px;
      top: -2.5px;
      left: 45%;
      color: rgb(121, 118, 118);
      white-space: nowrap;
    }
  }
  img {
    width: 22px;
    height: 23px;
    margin-right: 10px;
  }
}
</style>