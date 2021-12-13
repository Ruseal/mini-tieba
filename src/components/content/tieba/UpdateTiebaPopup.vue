<template>
  <div class="update-tieba-popup">
    <van-popup
      v-model="isShowTiebaUpdatePopup"
      close-icon-position="top-left"
      close-on-popstate
      position="bottom"
      :style="{ height: '100%' }"
      :overlay-style="{ background: 'rgba(0,0,0,0.7)' }"
      @open="initPopup"
    >
      <van-nav-bar title="修改吧资料">
        <img
          slot="left"
          class="left-exit"
          @click.stop="isShowTiebaUpdatePopup = false"
          src="@/assets/img/common/exit.png"
          alt=""
        />
        <div slot="right" @click="onConfirm" class="send">确认</div>
      </van-nav-bar>
      <div class="scroll">
        <van-cell title="吧头像" />
        <van-uploader
          class="uploads"
          v-model="fileList"
          multiple
          max-count="1"
          :before-read="beforeRead"
        />
        <van-cell title="吧简介" />
        <van-field
          v-model="message"
          rows="2"
          autosize
          label="简介"
          type="textarea"
          maxlength="500"
          placeholder="请输入简介"
          show-word-limit
        />
      </div>
    </van-popup>
  </div>
</template>

<script>
import { uploadTiebaAvatar, updateTiebaIntroduction } from "@/api/tieba-net";

import loading from "@/utils/loading";
export default {
  name: "",
  components: {},
  data() {
    return {
      isShowTiebaUpdatePopup: false,
      fileList: [],
      message: "",
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
    initPopup() {
      this.message = this.tiebaMsg.introduction;
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
    async onConfirm() {
      loading(this);
      if (this.fileList.length) {
        if (await this.uploadAvatar()) return;
      }
      if (this.tiebaMsg.introduction !== this.message) {
        if (await this.updateIntroduction()) return;
      }
      if (
        !this.fileList.length &&
        this.tiebaMsg.introduction === this.message
      ) {
        this.$toast("内容未修改");
        return;
      }
      this.$toast.success("修改成功,吧头像刷新页面后生效");
      this.isShowTiebaUpdatePopup = false;
      this.tiebaMsg.introduction = this.message;
    },
    async uploadAvatar() {
      try {
        let data = new FormData();
        this.fileList.forEach((objFile) => {
          data.append("tiebaAvatar", objFile.file);
        });
        const { status} = await uploadTiebaAvatar(
          data,
          this.tiebaMsg.id
        );
        if (status !== 200) throw new Error();
      } catch (err) {
        this.$toast.fail("修改吧头像失败");
        return true;
      }
    },
    async updateIntroduction() {
      try {
        const { status } = await updateTiebaIntroduction(
          this.tiebaMsg.id,
          this.message
        );
        if (status !== 200) throw new Error();
      } catch (err) {
        this.$toast.fail("更新吧简介失败");
        return true;
      }
    },
  },
};
</script>
<style lang='less' scoped>
.update-tieba-popup {
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
    width: 100vw;
    height: calc(100vh - 46px);
    .uploads {
      padding-left: 16px;
    }
    /deep/ .van-field__label {
      span {
        color: rgb(161, 161, 161);
        font-size: 14px;
      }
    }
    /deep/ .van-field__control {
      background-color: rgb(248, 249, 250);
    }
  }
}
</style>