<template>
  <div class="textarea-popup">
    <van-popup
      v-model="isShowTextareaPopup"
      close-icon-position="top-left"
      close-on-popstate
      position="bottom"
      :style="{ height: '20%' }"
      :overlay-style="{ background: 'rgba(255,255,255,0)' }"
      @close="close"
      @open="open"
      @click-overlay="clickOverlay"
    >
      <div class="popup-wrapper" @touchend.prevent>
        <div class="reply-text">
          <div v-if="textareaReply">
            回复&nbsp;{{ textareaReply.authorName }}:&nbsp;&nbsp;{{
              textareaReply.content
            }}
          </div>
          <div v-else>评论贴子</div>
        </div>
        <van-field
          class="textarea-field"
          v-model="message"
          rows="1"
          type="textarea"
          placeholder="我来评论"
          :autosize="{ maxHeight: 68 }"
          @touchend.stop
        />
        <div class="send" :class="{ nomessage: message }" @touchend="send">
          发表
        </div>
        <textarea-tab-bottom
          @onimg="onImageIcon"
          @clear-text="message = ''"
          :isImg="!textareaReply"
        />
      </div>
    </van-popup>
  </div>
</template>

<script>
import { publishedReply } from "@/api/detail-net";
import * as StoreConstant from "@/constant/store-constant";
import { mapState } from "vuex";
import loading from "@/utils/loading";
import statusHandle from "@/utils/status-handle";
import TextareaTabBottom from "../../common/TextareaTabBottom.vue";
export default {
  name: "",
  components: { TextareaTabBottom },
  data() {
    return {
      isShowTextareaPopup: false,
      message: "",
      textareaReply: null,
      sendReplyCommentId: 0,
    };
  },
  props: {
    detailId: {
      type: Number,
      default() {
        return 0;
      },
    },
  },
  mounted() {
    this.$bus.$on("textarea-popup", this.textareaPopup);
    this.$bus.$on("pass-comment-id", this.passCommentId);
  },
  destroyed() {
    this.$bus.$off("textarea-popup", this.textareaPopup);
    this.$bus.$off("pass-comment-id", this.passCommentId);
  },
  computed: {
    ...mapState({
      replyMsg: "replyMsg",
      commentMsg: "commentMsg",
    }),
  },
  methods: {
    send() {
      if (!this.message) return;
      if (!this.textareaReply) {
        this.$bus.$emit("emit-published", {
          message: this.message,
        });
        this.isShowTextareaPopup = false;
      } else {
        this.sendReply();
      }
    },
    async sendReply() {
      let result = null;
      try {
        loading(this);
        let commentId = this.sendReplyCommentId
          ? this.sendReplyCommentId
          : this.textareaReply.id;
        const { status } = await publishedReply(
          this.textareaReply.id,
          this.message,
          this.detailId,
          commentId
        );
        result = statusHandle(status);
        if (!result.success) throw new Error();
        this.isShowTextareaPopup = false;
        this.message = "";
        this.$toast.success("回复成功");
        this.$bus.$emit("fresh-reply-popup", this.textareaReply.id);
        this.$bus.$emit("sync-msg", { id: this.detailId, count: 1 });
      } catch (err) {
        this.$toast.fail("发表失败，请检查网络");
        result.message && this.$toast.fail(result.message);
      }
    },
    textareaPopup(event) {
      this.textareaReply = event;
      if (!this.textareaReply) {
        let item = this.commentMsg.find((item) => item.id === this.detailId);
        if (item && item.fileList.length) {
          this.$bus.$emit("textarea-img-popup", true);
          return;
        }
      }
      this.isShowTextareaPopup = true;
    },
    onImageIcon() {
      this.clickOverlay();
      this.$bus.$emit("textarea-img-popup", true);
      this.isShowTextareaPopup = false;
    },
    close() {
      if (!this.textareaReply) return;
      this.$store.commit(StoreConstant.SAVE_REPLY_MESSAGE, {
        id: this.textareaReply.id,
        message: this.message,
      });
    },
    open() {
      this.message = "";
      if (!this.textareaReply) {
        let item = this.commentMsg.find((item) => item.id === this.detailId);
        if (item) {
          this.message = item.message;
        }
      } else {
        let item = this.replyMsg.find(
          (item) => item.id === this.textareaReply.id
        );
        if (item) {
          this.message = item.message;
        }
      }
    },
    clickOverlay() {
      if (this.textareaReply) return;
      this.$store.commit(StoreConstant.SAVE_COMMENT_MESSAGE, {
        id: this.detailId,
        message: this.message,
        fileList: [],
      });
    },
    passCommentId(event) {
      this.sendReplyCommentId = event;
    },
  },
};
</script>
<style lang='less' scoped>
.textarea-popup {
  .popup-wrapper {
    border-top: 1px solid rgba(226, 224, 224, 0.7);
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0 10px;
    .reply-text div {
      width: 100%;
      height: 30px;
      line-height: 30px;
      font-size: 11px;
      color: #adadad;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .textarea-field {
      position: absolute;
      width: 75%;
    }
    .van-cell {
      padding: 10px;
      height: calc(100% - 35px - 30px);
      line-height: 16px;
      border-radius: 5px;
      background-color: #f3f4f6;
      /deep/ .van-field__control {
        font-size: 14px;
      }
    }
    .send {
      position: absolute;
      right: 10px;
      bottom: 35px;
      width: 60px;
      height: 28px;
      line-height: 28px;
      border-radius: 15px;
      text-align: center;
      color: white;
      background-color: rgb(175, 201, 238);
    }
    .nomessage {
      background-color: rgb(91, 129, 255);
    }
    .textarea-tab {
      position: absolute;
      display: flex;
      justify-content: space-between;
      align-items: center;
      right: 10px;
      left: 10px;
      height: 35px;
      bottom: 0;
      .icon-wrapper {
        display: flex;
        img {
          width: 22px;
          height: 20px;
          margin-right: 40px;
        }
      }
      .tab-right-claer {
        width: 30px;
        height: 20px;
        margin-right: 10px;
        border-left: 1px solid rgba(201, 199, 199, 0.5);
        box-sizing: content-box;
        padding-left: 10px;
      }
    }
  }
}
</style>