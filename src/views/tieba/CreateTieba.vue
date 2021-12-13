<template>
  <div class="create-tieba">
    <div class="nav">
      <left-arrow @click.native="$router.back()" class="arrow" />
      <div>创建贴吧</div>
      <div></div>
    </div>
    <loading v-if="statusData === 'loading'" />
    <tieba-error v-else-if="statusData === 'tieba-error'" />
    <error v-else-if="statusData === 'error'" />
    <scroll class="scroll" click v-else>
      <div class="wrap">
        <div class="title">创建吧资料</div>
        <!-- ------------用户名--------------- -->
        <van-field label="用户名" :placeholder="username" readonly />
        <!-- ------------贴吧名--------------- -->
        <van-field
          v-model="tiebaName"
          label="贴吧名"
          @focus="error.nameErr ? (error.nameErr = '') : ''"
          placeholder="给贴吧取个好听的名字"
          right-icon="edit"
          :error-message="error.nameErr"
          maxlength="9"
          clearable
        />
        <!-- ------------贴吧分类--------------- -->
        <van-field
          :value="tiebaCate"
          label="贴吧分类"
          @focus="error.cateErr ? (error.cateErr = '') : ''"
          placeholder="选择你的贴吧类别"
          :error-message="error.cateErr"
          @click="isShowAreaListPopup = !isShowAreaListPopup"
          readonly
          is-link
          clearable
        />
        <!-- ------------贴吧简介--------------- -->
        <van-field
          v-model="indct"
          type="textarea"
          label="贴吧简介"
          placeholder="介绍你创建的贴吧"
          :autosize="{ maxHeight: 100, minHeight: 0 }"
          show-word-limit
          maxlength="500"
          clearable
        />
        <!-- ------------是否关注贴吧(swtch)--------------- -->
        <van-field class="switch" label="默认关注此吧" readonly>
          <el-switch
            slot="right-icon"
            v-model="isOpenSwitch"
            :width="45"
            active-color="#0b8ffa"
            inactive-color="#c9cacc"
          >
          </el-switch>
        </van-field>
        <van-button
          @click="onCreate"
          class="commit"
          type="primary"
          size="large"
          color="red"
          round
        >
          创建
        </van-button>
      </div>
    </scroll>
    <van-popup
      v-model="isShowAreaListPopup"
      position="bottom"
      :style="{ height: '40%' }"
    >
      <van-area
        title="分类"
        :area-list="areaList"
        :columns-num="1"
        :columns-placeholder="['请选择']"
        @confirm="confirm"
        @cancel="cancel"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserMessage } from "@/api/user-net";
import {
  getCategoryList,
  createTieba,
  createTiebaArticle,
  focusTieba,
} from "@/api/tieba-net";
import loading from "@/utils/loading";
import LeftArrow from "@/components/common/LeftArrow.vue";
import Scroll from "@/components/common/Scroll.vue";
import Loading from "@/components/common/Loading.vue";
import TiebaError from "@/components/content/come/TiebaError.vue";
import Error from "@/components/common/Error.vue";
export default {
  name: "create-tieba",
  components: { LeftArrow, Scroll, Loading, TiebaError, Error },
  data() {
    return {
      statusData: "loading",

      username: "", //用户名
      tiebaName: "", // 贴吧名
      tiebaCate: "", //贴吧分类
      cateCode: null,
      indct: "", //贴吧简介

      isOpenSwitch: false,
      isShowAreaListPopup: false,
      error: {
        nameErr: "",
        cateErr: "",
      },
      areaList: {},
    };
  },
  created() {
    this.getUserMsgMethod();
    this.getCategoryListMethod();
  },
  methods: {
    confirm(e) {
      this.tiebaCate = e[0].name;
      this.cateCode = parseInt(e[0].code) + 3;
      this.isShowAreaListPopup = false;
    },
    cancel() {
      this.isShowAreaListPopup = false;
    },
    async getUserMsgMethod() {
      try {
        const { status, data } = await getUserMessage();
        if (status === 401) {
          this.statusData = "tieba-error";
          return;
        }
        if (status !== 200) throw new Error();
        this.statusData = "ok";
        this.username = data.username;
      } catch (err) {
        this.statusData = "error";
      }
    },
    async getCategoryListMethod() {
      try {
        const { status, data } = await getCategoryList();
        if (status === 401) {
          this.statusData = "tieba-error";
          return;
        }
        if (status !== 200) throw new Error();
        this.statusData = "ok";
        this.categoryList = data;
        this.areaList.province_list = Object.assign(
          {},
          this.categoryList.map((item) => item.name).slice(2)
        );
      } catch (error) {
        this.statusData = "error";
      }
    },
    onCreate() {
      if (!this.tiebaName.trim()) {
        this.error.nameErr = "该字段不能为空";
        return;
      }
      if (!this.tiebaCate) {
        this.error.cateErr = "该字段不能为空";
        return;
      }
      this.createTiebaMethod();
    },
    async createTiebaMethod() {
      loading(this);
      try {
        const data = {
          name: this.tiebaName,
          indct: this.indct.trim() ? this.indct.trim() : null,
          categoryId: this.cateCode,
        };
        const { status, service } = await createTieba(data);
        if (status === 400) {
          this.error.nameErr = "贴吧名已存在";
          this.$toast.clear();
          return;
        }
        if (status === 401) {
          this.statusData = "tieba-error";
          this.$toast.fail("登入已过期");
          return;
        }
        if (status !== 200) throw new Error();
        if (
          this.isOpenSwitch &&
          (await this.focusTiebaMethod(service.insertId))
        )
          throw new Error();
        if (await this.createArticle(service.insertId)) throw new Error();
        this.$toast.success("创建贴吧成功");
        this.$router.replace({
          name: "tieba",
          query: {
            tid: service.insertId,
          },
        });
      } catch (err) {
        this.$toast.fail("网络不稳定,创建失败");
      }
    },
    async focusTiebaMethod(tiebaId) {
      try {
        const { status } = await focusTieba(tiebaId);
        if (status !== 200) throw new Error();
      } catch (err) {
        this.$toast.fail("网络不稳定");
        return true;
      }
    },
    async createArticle(tiebaId) {
      try {
        const { status } = await createTiebaArticle(
          tiebaId,
          "【通知】 欢迎创建" +
            this.tiebaName +
            "吧！快邀请你的小伙伴来发贴吧！",
          null
        );
        if (status !== 200) throw new Error();
      } catch (err) {
        return true;
      }
    },
  },
};
</script>
<style lang='less' scoped>
.create-tieba {
  position: relative;
  width: 100vw;
  height: 100vh;
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 46px;
    .arrow {
      margin-left: 10px;
    }
  }
  .scroll {
    width: 100vw;
    height: calc(100vh - 46px);
    background-color: #f7f8fa;
    .wrap {
      width: 94vw;
      height: 500px;
      margin: 3vw auto;
      .title {
        font-size: 13px;
        color: rgb(99, 99, 99);
        padding: 10px 0;
      }
      .switch {
        margin-top: 15px;
      }
      .commit {
        margin-top: 30px;
        height: 45px;
      }
      .reset {
        margin-top: 15px;
        height: 45px;
      }
    }
  }
  .area-list {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  // .text {
  //   margin-top: 40%;
  //   text-align: center;
  //   font-size: 16px;
  //   font-weight: 600;
  // }
  // .ipt-wrapper {
  //   width: 100%;
  //   height: 50px;
  //   padding: 2px 10px;
  //   margin-top: 10px;
  //   background-color: rgb(255, 255, 255);
  //   input {
  //     width: 100%;
  //     height: 100%;
  //     padding: 0 10px;
  //     border: unset;
  //     border-radius: 10px;
  //     background-color: rgb(240, 240, 240);
  //   }
  // }
  // .prompt {
  //   margin-left: 10px;
  //   font-size: 12px;
  //   color: red;
  // }
  // .button {
  //   position: absolute;
  //   width: 90%;
  //   height: 40px;
  //   background-color: rgb(97, 160, 255);
  //   margin-left: 50%;
  //   border-radius: 40px;
  //   transform: translateX(-50%);
  //   bottom: 10px;
  //   padding: 0 10px;
  // }
}
</style>