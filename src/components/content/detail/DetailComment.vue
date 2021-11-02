<template>
  <div class="detail-comment">
    <user-label
      :user-label="{
        authId: commentItem.author.id,
        title: commentItem.author.nickname
          ? commentItem.author.nickname
          : commentItem.author.username,
        avatar: commentItem.author.avatar,
        member: commentItem.author.members,
        createTime: commentItem.createTime,
        level: commentItem.author.level ? commentItem.author.level : 1,
        floor: floor,
      }"
      avatarType="round"
      :label-type="[childLabelType, 'time']"
      isMember
      isLevelCard
      isFloor
    />
    <div
      class="comment-text"
      @touchstart="start"
      @touchend="end"
      @click="onComment"
    >
      <span v-if="commentItem.toReply && commentItem.toReply.replyCommentId">
        回复&nbsp;<span class="name-height-line">{{
          commentItem.toReply.toReplyNickName
            ? commentItem.toReply.toReplyNickName
            : commentItem.toReply.toReplyUserName
        }}</span
        >&nbsp;&nbsp;:
      </span>
      {{ commentItem.content }}
    </div>
    <div v-if="isHasImg">
      <img
        @touchstart="start"
        @touchend="end"
        @click="onComment"
        v-for="(img, index) in commentItem.imageList"
        :key="index"
        v-lazy="img"
        @load="imageLoad"
        class="comment-img"
        alt=""
      />
    </div>
    <div class="comment-bottom">
      <div>
        <div v-if="isHasReplyText" @click="onReplyText" class="left">
          <div class="text">
            {{ replyCountHandle }}
          </div>
          <left-arrow
            v-if="commentItem.replyCount"
            class="comment-bottom-arrow"
          />
        </div>
      </div>
      <div class="right">
        <img @click="likeHandle" :src="isLikeHandle" alt="" />
        <span>{{ likeCountHandle }}</span>
        <img src="@/assets/img/detail/shallow/unlove.png" alt="" />
        <img
          @click="onComment"
          src="@/assets/img/detail/shallow/msg.png"
          alt=""
        />
        <img
          v-if="isHasShare"
          src="@/assets/img/detail/shallow/share.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
import { like, unlike } from "@/api/detail-net";

import statusHandle from "@/utils/status-handle";
import LeftArrow from "../../common/LeftArrow.vue";
import UserLabel from "../../common/UserLabel.vue";
export default {
  name: "",
  components: { UserLabel, LeftArrow },
  data() {
    return {
      replyCount: 0,
      timer: null,
      startTime: 0,
      articleId: 0,
    };
  },
  props: {
    commentItem: {
      type: Object,
      required: true,
    },
    isHasImg: {
      type: Boolean,
      default() {
        return false;
      },
    },
    isHasShare: {
      type: Boolean,
      default() {
        return false;
      },
    },
    isHasReplyText: {
      type: Boolean,
      default() {
        return false;
      },
    },
    childLabelType: {
      type: String,
      default() {
        return "";
      },
    },
    floor: {
      type: Number,
      default() {
        return 0;
      },
    },
  },
  computed: {
    replyCountHandle() {
      if (this.replyCount) {
        return `查看${this.replyCount}条回复`;
      } else {
        return this.commentItem.replyCount
          ? `查看${this.commentItem.replyCount}条回复`
          : "回复";
      }
    },
    likeCountHandle() {
      return this.commentItem.likeCount ? this.commentItem.likeCount : "赞";
    },
    isLikeHandle() {
      return this.commentItem.isLike
        ? require("@/assets/img/common/love_active.png")
        : require("@/assets/img/detail/shallow/love.png");
    },
  },
  mounted() {
    this.$bus.$on("fresh-reply-count", this.freshReplyCount);
  },
  destroyed() {
    this.$bus.$off("fresh-reply-count", this.freshReplyCount);
  },
  methods: {
    async likeHandle() {
      let result = null;
      try {
        if (this.commentItem.isLike) {
          const { status } = await unlike(this.commentItem.id);
          result = statusHandle(status);
          if (!result.success) throw new Error();
          this.commentItem.likeCount -= 1;
          this.commentItem.isLike = !this.commentItem.isLike;
        } else {
          const { status } = await like(this.commentItem.id);
          result = statusHandle(status);
          if (!result.success) throw new Error();
          this.commentItem.likeCount += 1;
          this.commentItem.isLike = !this.commentItem.isLike;
        }
      } catch (err) {
        this.$toast.fail("网络错误");
        this.result.message && this.$toast.fail(result.message);
      }
    },
    freshReplyCount(event) {
      if (event.commentid !== this.commentItem.id) return;
      this.replyCount = event.count;
    },
    imageLoad() {
      this.$emit("image-load");
    },
    onReplyText() {
      this.$bus.$emit("reply-popup", {
        isShowPopup: true,
        commentItem: this.commentItem,
      });
    },
    start() {
      this.startTime = new Date().getTime();
      this.timer = setTimeout(() => {
        this.$bus.$emit("delete-popup", this.commentItem);
      }, 1000);
    },
    end(event) {
      if (new Date().getTime() - this.startTime > 1000) {
        event.stopPropagation();
      } else {
        clearTimeout(this.timer);
      }
    },
    onComment() {
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
.detail-comment {
  width: 100%;
  padding: 10px 10px 0;
  background-color: #fff;
  .comment-text {
    width: calc(100% - 42px);
    margin-left: 42px;
    margin-top: 6px;
    .name-height-line {
      color: blue;
    }
  }
  .comment-img {
    width: calc(100% - 42px);
    margin-left: 42px;
    margin-top: 5px;
    border-radius: 6px;
    max-height: 600px;
    object-fit: cover;
    object-position: top;
  }
  .comment-bottom {
    display: flex;
    justify-content: space-between;
    width: calc(100% - 42px);
    margin: 10px 0 0 42px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(224, 223, 226, 0.5);
    .left {
      display: flex;
      align-items: center;
      .text {
        font-size: 13px;
        color: rgb(158, 155, 155);
      }
      .comment-bottom-arrow {
        width: 6px;
        height: 6px;
        border-top: 2px solid rgb(158, 155, 155);
        border-left: 2px solid rgb(158, 155, 155);
        transform: rotate(135deg);
      }
    }
    .right {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-right: 0;
      img {
        width: 14px;
        height: 14px;
        margin-left: 14px;
      }
      span {
        color: rgb(158, 155, 155);
        font-size: 11px;
        margin-left: 14px;
      }
    }
  }
}
</style>