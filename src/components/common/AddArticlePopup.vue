<template>
  <div class="add-article-popup">
    <van-popup
      v-model="isShowAddArticlePopup"
      close-icon-position="top-left"
      close-on-popstate
      position="bottom"
      :style="{ height: '100%' }"
      :overlay-style="{ background: 'rgba(0,0,0,0.7)' }"
      @closed="closed"
    >
      <van-nav-bar title="发布贴子">
        <img
          slot="left"
          class="left-exit"
          @click.stop="isShowAddArticlePopup = false"
          src="@/assets/img/common/tieba-avatar/exit_highlight.png"
          alt=""
        />
        <div
          @click="onSend"
          slot="right"
          class="send"
          :class="{
            'send-disable':
              (title.trim() || text.trim()) && Object.keys(tiebaMsg).length,
          }"
        >
          发布
        </div>
      </van-nav-bar>
      <div class="scroll">
        <van-cell-group>
          <van-cell :is-link="isChoose || !Object.keys(tiebaMsg).length">
            <div slot="title" class="title">
              <div v-show="!isChoose && Object.keys(tiebaMsg).length">
                发布到&nbsp;&nbsp;<span>{{ tiebaMsg.tiebaName }}吧</span>
              </div>
              <div
                v-show="!isChoose && !Object.keys(tiebaMsg).length"
                @click="showPopup"
              >
                选择吧&nbsp;&nbsp;<van-tag
                  size="medium"
                  color="rgb(236, 236, 236)"
                  type="danger"
                  text-color="rgb(170, 170, 170)"
                  round
                  >选择发布的吧</van-tag
                >
              </div>
              <div @click="showPopup" v-show="isChoose">
                发布到&nbsp;&nbsp;<span>{{ tiebaName }}吧</span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
        <van-field
          class="title-field"
          placeholder="这个贴子距离火就差这个标题"
          v-model="title"
          :maxlength="25"
        />
        <van-field
          v-model="text"
          rows="1"
          autosize
          type="textarea"
          placeholder="来吧，尽情发挥吧..."
        />
        <van-uploader
          class="uploads"
          v-model="fileList"
          multiple
          max-count="10"
          :before-read="beforeRead"
        />
      </div>
    </van-popup>
    <tieba-list-popup @choose="chooseTieba" ref="tiebaListPopupRef" />
  </div>
</template>

<script>
import { releaseArticle, uploadArticlePicture } from "@/api/tieba-net";
import statusHandle from "@/utils/status-handle";
import loading from "@/utils/loading";
import TiebaListPopup from "../content/home/TiebaListPopup.vue";
export default {
  name: "",
  components: { TiebaListPopup },
  data() {
    return {
      isShowAddArticlePopup: false,
      title: "",
      text: "",
      fileList: [],
      currentSendArticleId: 0,
      isChoose: false,
      tiebaName: "",
    };
  },
  props: {
    tiebaMsg: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    async onSend() {
      if (
        (!this.title.trim() && !this.text.trim()) ||
        !Object.keys(this.tiebaMsg).length
      )
        return;
      loading(this);
      if (await this.releaseArticleMethod()) return;
      if (await this.uploadArticlePictureMethod()) return;
      this.$emit("unshift-article", this.currentSendArticleId);
      this.isShowAddArticlePopup = false;
      this.$toast.success("发布成功");
    },
    async releaseArticleMethod() {
      let result = null;
      try {
        const { status, service } = await releaseArticle(
          this.tiebaMsg.id,
          this.title ? this.title : null,
          this.text ? this.text : null
        );
        result = statusHandle(status);
        if (!result.success) throw new Error();
        this.currentSendArticleId = service.insertId;
      } catch (err) {
        this.$toast.fail("网络错误");
        this.result.message && this.$toast.fail(result.message);
        return true;
      }
    },
    async uploadArticlePictureMethod() {
      try {
        let data = new FormData();
        this.fileList.forEach((objFile) => {
          data.append("articlePictrue", objFile.file);
        });
        const { status } = await uploadArticlePicture(
          data,
          this.currentSendArticleId
        );
        if (status !== 200) throw new Error();
      } catch (err) {
        this.$emit("unshift-article", this.currentSendArticleId);
        this.isShowAddArticlePopup = false;
        this.$toast.fail("网络错误,图片发布失败");
        return true;
      }
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
    showPopup() {
      this.$refs.tiebaListPopupRef.isShowTiebaListPopup = true;
    },
    closed() {
      this.title = "";
      this.text = "";
      this.fileList = [];
      if (Object.keys(this.tiebaMsg).length > 1) return;
      this.isChoose = false;
      delete this.tiebaMsg.id;
    },
    chooseTieba(obj) {
      this.tiebaMsg.id = obj.tiebaItem.id;
      this.isChoose = true;
      this.tiebaName =
        obj.active === 0
          ? obj.tiebaItem.tiebaName
          : obj.tiebaItem.tieba.tiebaName;
    },
  },
};
</script>
<style lang='less' scoped>
.add-article-popup {
  /deep/.van-nav-bar__title {
    font-size: 14px;
  }
  .left-exit {
    width: 14px;
    height: 14px;
  }
  .send {
    color: rgb(177, 204, 243);
  }
  .send-disable {
    color: rgb(48, 82, 231);
  }
  .scroll {
    position: fixed;
    width: 100%;
    height: calc(100vh - 46px);
    overflow-y: auto;

    .title {
      span {
        color: blue;
        font-size: 13px;
      }
    }
    .title-field {
      border-top: 1px solid rgba(236, 236, 236, 0.5);
      border-bottom: 1px solid rgba(219, 219, 219, 0.5);
    }
    .uploads {
      padding: 10px;
    }
  }
}
</style>