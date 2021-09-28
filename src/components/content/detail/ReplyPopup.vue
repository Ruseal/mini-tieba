<template>
  <div class="reply-popup">
    <van-popup
      v-model="isShowReplyPopup"
      close-icon-position="top-left"
      close-on-popstate
      position="bottom"
      @opened="mountedDom"
      @open="open"
      @closed="clearReply"
      :style="{ height: '85%' }"
      :overlay-style="{ background: 'rgba(0,0,0,0.7)' }"
      round
    >
      <van-nav-bar title="标题">
        <img
          slot="left"
          class="left-exit"
          @click.stop="replyPopup({ isShowPopup: false })"
          src="@/assets/img/common/exit.png"
          alt=""
        />
      </van-nav-bar>
      <div v-if="dataStatus === 'loadding'">loading...</div>
      <div v-else-if="dataStatus === 'error'">error</div>
      <div v-else class="scroll" ref="scrollRef">
        <detail-comment
          :comment-item="commentItem"
          child-label-type="floor"
          isHasImg
          isHasShare
        />
        <div class="reply-count">
          {{ commentItem && commentItem.replyCount }}条回复
        </div>
        <div v-if="!replyList.length" class="not-reply-list">此楼还没有回复哦~</div>
        <div v-else>
          <detail-comment
            v-for="item in replyList"
            :comment-item="item"
            :key="item.id"
            child-label-type="time"
          />
        </div>
      </div>
      <div class="reply-popup-bottom" @click="onReplyBottom">
        <div>
          <img :src="$store.state.userAvatar" alt="" /><span>{{
            commentItem ? isMsg() : "我来抢楼"
          }}</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getReply } from "@/api/detail-net";

import LeftArrow from "../../common/LeftArrow.vue";
import Scroll from "../../common/Scroll.vue";
import DetailComment from "./DetailComment.vue";
import { mapState } from "vuex";
export default {
  name: "",
  components: { LeftArrow, Scroll, DetailComment },
  data() {
    return {
      isShowReplyPopup: false,
      commentItem: null,
      dataStatus: "loadding",
      replyList: [],
    };
  },
  mounted() {
    this.$bus.$on("reply-popup", this.replyPopup);
    this.$bus.$on("fresh-reply-popup", this.mountedDom);
  },
  destroyed() {
    this.$bus.$off("reply-popup", this.replyPopup);
    this.$bus.$off("fresh-reply-popup", this.mountedDom);
  },
  computed: {
    ...mapState({
      replyMsg: "replyMsg",
    }),
    isMsg() {
      return () => {
        let item = this.replyMsg.find(
          (item) => item.id === this.commentItem.id
        );
        if (!item || !item.message) return "我来抢楼";
        return "[草稿待发送]";
      };
    },
  },
  methods: {
    open() {
      this.isMsg();
      this.$bus.$emit("pass-comment-id", this.commentItem.id);
    },
    onReplyLeft() {
      this.$emit("reply-popup", false);
    },
    clearReply() {
      this.$bus.$emit("pass-comment-id", 0);
      this.replyList = [];
      this.dataStatus = "loadding";
    },
    replyPopup(event) {
      this.isShowReplyPopup = event.isShowPopup;
      if (!event.commentItem) return;
      this.commentItem = event.commentItem;
    },
    async mountedDom(event) {
      let id = this.commentItem ? this.commentItem.id : event;
      try {
        const { data, status } = await getReply(id);
        if (status !== 200) throw new Error();
        this.dataStatus = "ok";
        this.replyList = data;
        this.$bus.$emit("fresh-reply-count", {
          count: this.replyList.length,
          commentid: event,
        })
      } catch (err) {
        this.dataStatus = "error";
      }
    },
    onReplyBottom() {
      this.$bus.$emit("textarea-popup", {
        id: this.commentItem.id,
        authorName: this.commentItem.author.nickname
          ? this.commentItem.author.nickname
          : this.commentItem.author.username,
        content: this.commentItem.content,
      });
    },
  },
};
</script>
<style lang='less' scoped>
.reply-popup {
  .left-exit {
    width: 14px;
    height: 14px;
  }
  .scroll {
    position: fixed;
    overflow-y: auto;
    width: 100%;
    height: calc(85% - 46px - 35px);
    .reply-count {
      width: 100%;
      height: 42px;
      line-height: 42px;
      padding-left: 10px;
      font-size: 15px;
      border-top: 8px solid rgba(228, 234, 241, 0.5);
    }
    .not-reply-list {
      width: 100%;
      height: 200px;
      font-size: 13px;
      text-align: center;
      margin-top: 30px;
      color: rgb(153, 153, 153);
    }
  }
  .reply-popup-bottom {
    position: fixed;
    left: 0;
    right: 0;
    height: 35px;
    bottom: 0;
    padding: 5px 10px;
    div {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      border-radius: 15px;
      background-color: #f3f4f6;
      img {
        width: 23px;
        height: 22px;
        object-fit: cover;
        object-position: center;
        border-radius: 11px;
        margin-left: 5px;
      }
      span {
        font-size: 13px;
        color: #9a9b9d;
        margin-left: 10px;
      }
    }
  }
}
</style>