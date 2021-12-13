<template>
  <div class="user-edit">
    <van-nav-bar title="编辑资料">
      <left-arrow slot="left" @click.native="$router.back()" />
      <div slot="right" @click="saveUserMsg" class="save">保存</div>
    </van-nav-bar>
    <van-uploader
      class="uploads"
      v-model="fileList"
      multiple
      max-count="1"
      :before-read="beforeRead"
      ><div class="alter-img"></div
    ></van-uploader>
    <van-field label="用户名" :placeholder="userMsg.username" readonly />
    <van-field
      label="昵称"
      v-model="nickname"
      placeholder="1-8个字之间"
      maxlength="8"
      right-icon="edit"
    />
    <van-field label="贴吧ID" :placeholder="userMsg.id + ''" readonly />
    <van-field
      label="性别"
      v-model="gender"
      placeholder="选择你的性别"
      readonly
      right-icon="edit"
      @click="isShowGenderPopup = true"
    />
    <van-field
      label="吧龄"
      :placeholder="formatYear(userMsg.createTime)"
      readonly
    />
    <van-field
      v-model="message"
      rows="1"
      label="简介"
      type="textarea"
      placeholder="填写简介更容易获得关注哦~"
      maxlength="500"
      show-word-limit
      :autosize="{ maxHeight: 100 }"
    />
    <van-popup
      v-model="isShowGenderPopup"
      round
      position="bottom"
      :style="{ height: '20%' }"
    >
      <div class="title">选择性别</div>
      <div class="select" @click="selectd('男')">男</div>
      <div class="select" @click="selectd('女')">女</div>
      <div class="select" @click="selectd(null)">取消</div>
    </van-popup>
  </div>
</template>

<script>
import { uploadUserAvatar, updateUser } from "@/api/user-net";
import formatYear from "@/utils/format-year";
import LeftArrow from "@/components/common/LeftArrow.vue";
export default {
  name: "user-edit",
  components: { LeftArrow },
  data() {
    return {
      userMsg: null,
      fileList: [],
      nickname: null,
      gender: null,
      message: "",
      defaultMsg: "这人很懒，什么也没有留下。",
      isShowGenderPopup: false,
    };
  },
  created() {
    this.userMsg = this.$route.query.userMsg;
  },
  computed: {
    formatYear() {
      return formatYear();
    },
  },
  mounted() {
    this.editAssignHandle();
  },
  methods: {
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
    editAssignHandle() {
      this.fileList = this.userMsg.avatar
        ? [{ url: this.userMsg.avatar, isImage: true }]
        : [
            {
              url: require("@/assets/img/common/default/user_default.jpg"),
              isImage: true,
            },
          ];
      this.nickname = this.userMsg.nickname ? this.userMsg.nickname : null;
      this.gender =
        this.userMsg.gender === null
          ? this.userMsg.gender
          : this.userMsg.gender === "男"
          ? "男"
          : "女";
      this.message =
        this.userMsg.introduction === "" ||
        this.userMsg.introduction === this.defaultMsg
          ? null
          : this.userMsg.introduction;
      console.log(this.gender);
    },
    selectd(gender) {
      this.isShowGenderPopup = false;
      if (!gender) return;
      this.gender = gender;
    },
    async uploadUserAvatarMethod() {
      try {
        let data = new FormData();
        this.fileList.forEach((objFile) => {
          data.append("userAvatar", objFile.file);
        });
        const { status } = await uploadUserAvatar(data);
        if (status !== 200) throw new Error();
        return true;
      } catch (err) {
        return false;
      }
    },
    async updateUserMethod() {
      try {
        const { status } = await updateUser({
          nickname: this.nickname,
          gender: this.gender || null,
          message: this.message,
        });
        if (status !== 200) throw new Error();
        return true;
      } catch (err) {
        return false;
      }
    },
    saveUserMsg() {
      if (!this.fileList.length) {
        this.$toast.fail("请添加上传头像");
        return;
      }
      if (Object.keys(this.fileList[0]).length !== 2) {
        if (!this.uploadUserAvatarMethod()) {
          this.$toast.fail("网络错误请稍后再进行操作!");
          return;
        }
      }
      if (!this.updateUserMethod()) {
        this.$toast.fail("网络错误,修改用户信息失败");
        return;
      }
      this.$toast.success("修改资料成功，用户头像刷新后生效");
      this.$router.back();
    },
  },
};
</script>
<style lang='less' scoped>
.user-edit {
  /deep/ .van-nav-bar__title {
    font-size: 14px;
  }
  .left-exit {
    width: 14px;
    height: 14px;
  }
  .save {
    color: rgb(48, 82, 231);
  }
  .uploads {
    margin-top: 20px;
    margin-left: 50%;
    margin-bottom: 50px;
    transform: translateX(-50%);
    /deep/ .van-uploader__preview-image {
      width: 120px;
      height: 115px;
      border-radius: 60px;
    }
    .alter-img {
      width: 120px;
      height: 115px;
      border-radius: 60px;
      border: 1px solid rgba(117, 117, 117, 0.5);
      background-color: rgb(245, 245, 245);
    }
  }
  .title,
  .select {
    text-align: center;
    line-height: 35px;
    height: 25%;
    // background-color: rgb(128, 80, 80);
  }
  .title {
    font-size: 12px;
    color: rgb(201, 201, 201);
  }
  .select {
    font-size: 13px;
  }
}
</style>