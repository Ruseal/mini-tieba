<template>
  <div class="setting">
    <set-nav />
    <scroll class="scroll">
      <div class="placeholder"></div>
      <van-cell class="account-cell" title="账号管理" is-link center>
        <img slot="default" src="@/assets/img/editor/baidu_icon.png" alt="" />
      </van-cell>
      <van-cell class="account-cell my-cell" title="个人资料" is-link center>
        <img slot="default" :src="userAvatar" alt="" />
      </van-cell>
      <van-cell title="兴趣设置" is-link center />
      <van-cell title="我的账号" is-link center />
      <van-cell class="set-night" title="夜间模式" center>
        <div slot="default">
          <el-switch
            :width="45"
            v-model="isOpenSwitch"
            active-color="#0b8ffa"
            inactive-color="#c9cacc"
          >
          </el-switch>
        </div>
      </van-cell>
      <van-cell title="消息提醒" is-link />
      <van-cell title="隐私设置" is-link />
      <van-cell class="cell-button" title="版本信息" is-link />
      <van-cell title="意见反馈" is-link />
      <van-button
        class="exit-bottom"
        @click="showPopup"
        type="default"
        size="large"
      >
        退出登入
      </van-button>
      <van-popup
        :overlay-style="{ backgroundColor: 'rgba(0,0,0,.3)' }"
        round
        v-model="isShowExitPopup"
        position="bottom"
        :style="{ height: '15%' }"
      >
        <div class="popup-text">确定退出账号吗?</div>
        <div @click="exitLoginMethod" class="popup-text">确定退出</div>
        <div @click="hidePopup" class="popup-text">取消</div>
      </van-popup>
    </scroll>
  </div>
</template>

<script>
import { exitLogin } from "@/api/login-net";
import loading from "@/utils/loading";

import SetNav from "@/components/content/editor/SetNav.vue";
import Scroll from "@/components/common/Scroll.vue";

import { mapState } from "vuex";
export default {
  name: "",
  components: {
    SetNav,
    Scroll,
  },
  data() {
    return {
      isOpenSwitch: false,
      isShowExitPopup: false,
    };
  },
  props: {},
  computed: {
    ...mapState({
      userAvatar: "userAvatar",
    }),
  },
  methods: {
    showPopup() {
      this.isShowExitPopup = true;
    },
    hidePopup() {
      this.isShowExitPopup = false;
    },
    async exitLoginMethod() {
      loading(this);
      const res = await exitLogin();
      this.$toast.clear();
      try {
        if (res.status === 200) {
          localStorage.removeItem("token");
          this.$router.replace("/login-user");
        }
      } catch (error) {
        this.$toast.fail("请检查网络");
      }
    },
  },
};
</script>
<style lang='less' scoped>
.setting {
  width: 100vw;
  height: 100vh;
  .scroll {
    background-color: #f1f3f8;
    height: calc(100vh - 46px);
    .placeholder {
      padding-top: 15px;
    }
    .van-cell {
      height: 50px;
    }
    .account-cell {
      margin-bottom: 15px;
      img {
        width: 20px;
        height: 20px;
        margin-right: 15px;
        transform: translateY(20%);
      }
    }
    .my-cell {
      margin-bottom: 0;
      img {
        width: 30px;
        height: 30px;
        object-fit: cover;
        object-position: center;
        margin-right: 10px;
        border-radius: 5px;
      }
    }
    .set-night {
      margin: 15px 0;
    }
    .cell-button {
      margin-top: 15px;
    }
    .exit-bottom {
      margin-top: 15px;
      color: red;
    }
    .popup-text {
      text-align: center;
    }
    .popup-text:nth-child(1) {
      height: 30%;
      font-size: 12px;
      line-height: 250%;
      color: rgb(161, 159, 159);
    }
    .popup-text:nth-child(2) {
      height: 35%;
      color: red;
      line-height: 250%;
    }
    .popup-text:nth-child(3) {
      height: 35%;
      color: rgb(92, 92, 92);
      line-height: 250%;
    }
  }
}
</style>