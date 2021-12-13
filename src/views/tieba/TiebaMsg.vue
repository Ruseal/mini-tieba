<template>
  <div class="tieba-msg">
    <van-nav-bar title="吧资料">
      <left-arrow @click.native="$router.back()" slot="left" />
    </van-nav-bar>
    <div class="title">
      <img
        :src="
          tiebaMsg.avatar
            ? tiebaMsg.avatar
            : require('@/assets/img/common/default/tieba_default.png')
        "
        alt=""
      />
      <div class="center">
        <div>{{ tiebaMsg.tiebaName }}</div>
        <div>
          关注&nbsp;{{ tiebaMsg.focusCount }}&nbsp;&nbsp;贴子&nbsp;{{
            tiebaMsg.commentCount
          }}
        </div>
      </div>
      <div
        class="button"
        @click="onFocus"
        :class="{ isfocus: tiebaMsg.cardMsg.isFocus }"
      >
        {{ tiebaMsg.cardMsg.isFocus ? "已关注" : "关注" }}
      </div>
    </div>
    <div class="introduction">
      <div>吧简介</div>
      <div>
        {{
          tiebaMsg.introduction
            ? tiebaMsg.introduction
            : tiebaMsg.maxAuth
            ? "吧主很懒，什么也没有留下！"
            : "[暂无吧简介...]"
        }}
      </div>
    </div>
    <van-cell
      @click="onApplyAuth"
      title="吧主申请"
      is-link
      :value="tiebaMsg.maxAuth ? '已有吧主' : ''"
    />
    <van-cell
      v-if="tiebaMsg.yourUserId === (tiebaMsg.maxAuth && tiebaMsg.maxAuth.id)"
      @click="onUpdate"
      title="修改吧资料"
      is-link
    />
    <van-button
      class="bottom-button"
      type="primary"
      size="large"
      @click="$router.back()"
      >进吧</van-button
    >
    <update-tieba-popup :tieba-msg="tiebaMsg" ref="updateTiebaPopupRef" />
  </div>
</template>

<script>
import { unFocusTieba } from "@/api/tieba-net";
import mixins from "@/mixins/mixin";
import LeftArrow from "@/components/common/LeftArrow.vue";
import UpdateTiebaPopup from "@/components/content/tieba/UpdateTiebaPopup.vue";
export default {
  name: "tieba-msg",
  components: {
    LeftArrow,
    UpdateTiebaPopup,
  },
  mixins: [mixins],
  data() {
    return {
      tiebaMsg: {},
    };
  },
  created() {
    this.tiebaMsg = this.$route.query.msg;
  },
  methods: {
    aaa() {
      console.log("pouuuu");
      console.log(this.tiebaMsg);
    },
    onApplyAuth() {
      if (this.tiebaMsg.maxAuth) {
        this.$toast("已有吧主不可申请");
        return;
      }
      this.$router.replace({
        name: "apply-auth",
        query: {
          level: this.tiebaMsg.cardMsg.level,
          tiebaId: this.tiebaMsg.id,
          author: this.tiebaMsg.maxAuth,
        },
      });
    },
    onUpdate() {
      this.$refs.updateTiebaPopupRef.isShowTiebaUpdatePopup = true;
    },
    onFocus() {
      if (this.tiebaMsg.cardMsg.isFocus) {
        this.$dialog
          .confirm({
            title: "取消关注",
            message: "取消关注贴吧后该贴吧等级清零,确认不在关注此吧?",
          })
          .then(() => {
            this.unFocusTiebaMethod();
          })
          .catch(() => {});
        return;
      }
      this.focusTiebaMethod();
    },
    async unFocusTiebaMethod() {
      try {
        const { status } = await unFocusTieba(this.tiebaMsg.id);
        if (status !== 200) throw new Error();
        this.tiebaMsg.cardMsg.isFocus = false;
        this.tiebaMsg.focusCount -= 1;
        this.$toast("取消关注");
        localStorage.removeItem("sign-time" + this.tiebaMsg.id);
      } catch (err) {
        this.$toast.fail("操作失败");
      }
    },
  },
};
</script>
<style lang='less' scoped>
.tieba-msg {
  .title {
    position: relative;
    display: flex;
    align-items: center;
    padding: 10px 16px;
    img {
      width: 52px;
      height: 50px;
      border-radius: 18px;
      margin-right: 15px;
      object-fit: cover;
      object-position: center;
    }
    .center {
      div:nth-child(1) {
        font-size: 15px;
        font-weight: 550;
      }
      div:nth-child(2) {
        margin-top: 3px;
        font-size: 12px;
        color: rgb(199, 199, 199);
      }
    }
    .button {
      position: absolute;
      right: 16px;
      width: 60px;
      height: 25px;
      text-align: center;
      font-size: 13px;
      line-height: 25px;
      border-radius: 25px;
      color: rgb(41, 41, 255);
      background-color: rgb(223, 225, 255);
    }
    .isfocus {
      background-color: rgb(240, 239, 239);
      color: rgb(117, 117, 117);
    }
  }
  .introduction {
    padding: 0 16px;
    margin-bottom: 15px;
    div:nth-child(1) {
      margin-top: 10px;
      font-size: 15px;
      font-weight: 600;
    }
    div:nth-child(2) {
      margin-top: 10px;
      font-size: 12px;
    }
  }
  .van-cell__value {
    span {
      font-size: 12px;
    }
  }
  .bottom-button {
    position: absolute;
    bottom: 10px;
    width: 90%;
    height: 40px;
    margin-left: 50%;
    transform: translateX(-50%);
    border-radius: 20px;
    background-color: rgb(121, 112, 253);
  }
}
</style>