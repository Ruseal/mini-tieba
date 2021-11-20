<template>
  <div class="textarea-img-popup">
    <van-popup
      v-model="isShowImgTextareaPopup"
      close-icon-position="top-left"
      close-on-popstate
      position="bottom"
      :style="{ height: '100%' }"
      :overlay-style="{ background: 'rgba(0,0,0,0.7)' }"
      @open="open"
      @close="close"
    >
      <van-nav-bar title="回复">
        <img
          slot="left"
          class="left-exit"
          @click.stop="textareaImgPopup(false)"
          src="@/assets/img/common/exit.png"
          alt=""
        />
        <div slot="right" class="send" @click="sendComment">发布</div>
      </van-nav-bar>
      <div class="scroll">
        <van-field
          class="textarea-field"
          v-model="message"
          rows="1"
          :autosize="{ maxHeight: 250 }"
          type="textarea"
          placeholder="评论"
        />
        <van-uploader
          class="uploads"
          v-model="fileList"
          multiple
          max-count="10"
          :before-read="beforeRead"
        />
      </div>
      <textarea-tab-bottom />
    </van-popup>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { publishedComment, uploadCommentPictrue } from "@/api/detail-net";
import * as StoreConstant from "@/constant/store-constant";
import statusHandle from "@/utils/status-handle";
import loading from "@/utils/loading";
import TextareaTabBottom from "../../common/TextareaTabBottom.vue";
export default {
  name: "",
  components: { TextareaTabBottom },
  data() {
    return {
      isShowImgTextareaPopup: false,
      message: "",
      fileList: [],
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
  computed: {
    ...mapState({
      commentMsg: "commentMsg",
    }),
  },
  mounted() {
    this.$bus.$on("textarea-img-popup", this.textareaImgPopup);
    this.$bus.$on("emit-published", this.againMessage);
  },
  destroyed() {
    this.$bus.$off("textarea-img-popup", this.textareaImgPopup);
    this.$bus.$off("emit-published", this.againMessage);
  },
  methods: {
    againMessage(event) {
      this.message = event.message;
      this.sendComment();
    },
    beforeRead(file) {
      if (file.length) {
        if (
          !!file.find(
            (fileItem) =>
              !["image/jpeg", "image/png", "image/gif"].includes(fileItem.type)
          )
        ) {
          this.$toast("请上传 jpg 格式图片");
          return false;
        }
      } else if (
        !["image/jpeg", "image/png", "image/gif"].includes(file.type)
      ) {
        this.$toast("请上传 jpg 格式图片");
        return false;
      }
      return true;
    },
    textareaImgPopup(event) {
      this.isShowImgTextareaPopup = event;
    },

    async sendComment() {
      let result = null;
      try {
        loading(this);
        const contentRes = await publishedComment(this.message, this.detailId);
        result = statusHandle(contentRes.status);
        if (!result.success) throw new Error(result.message);
        if (!this.fileList.length) {
          this.isShowImgTextareaPopup = false;
          this.message = "";
          this.$toast.success("发表评论成功");
          this.$bus.$emit("fresh-comment");
          this.$bus.$emit("sync-msg", { id: this.detailId, count: 1 });
          return;
        }
        let data = new FormData();
        this.fileList.forEach((objFile) => {
          data.append("commentPictrue", objFile.file);
        });
        const pictrueRes = await uploadCommentPictrue(
          data,
          contentRes.service.insertId
        );
        result = statusHandle(pictrueRes.status);
        if (!result.success) throw new Error();
        this.isShowImgTextareaPopup = false;
        this.message = "";
        this.fileList = [];
        this.$toast.success("发表评论成功");
        this.$bus.$emit("fresh-comment");
        this.$bus.$emit("sync-msg", { id: this.detailId, count: 1 });
      } catch (err) {
        this.$toast.fail("发表失败，请检查网络");
        result.message && this.$toast.fail(result.message);
      }
    },
    close() {
      this.$store.commit(StoreConstant.SAVE_COMMENT_MESSAGE, {
        id: this.detailId,
        message: this.message,
        fileList: this.fileList,
      });
    },
    open() {
      this.message = "";
      let item = this.commentMsg.find((item) => item.id === this.detailId);
      if (item) {
        this.message = item.message;
        this.fileList = item.fileList;
      }
    },
  },
};
</script>
<style lang='less' scoped>
.textarea-img-popup {
  .left-exit {
    width: 14px;
    height: 14px;
  }
  .send {
    color: rgb(48, 82, 231);
  }
  .scroll {
    position: fixed;
    overflow-y: auto;
    left: 10px;
    right: 10px;
    height: calc(100vh - 46px - 45px - 35px);
    .textarea-field {
      position: relative;
      padding: 10px;
      margin-bottom: 30px;
    }
    .van-cell {
      line-height: 18px;
      /deep/ .van-field__control {
        font-size: 14px;
      }
    }
  }
}
</style>