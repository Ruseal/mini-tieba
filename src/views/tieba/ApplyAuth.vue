<template>
  <div class="apply-auth">
    <div class="nav">
      <left-arrow @click.native="$router.back()" class="arrow" />
      <div>创建贴吧</div>
      <div></div>
    </div>
    <img class="fake-img" src="@/assets/img/come/tb.jpg" alt="" />
    <div class="wrapper">
      <img src="@/assets/img/come/level_apply.png" alt="" />
      <div class="right">
        <div>吧等级</div>
        <div class="bottom">吧内等级达到3级以上</div>
      </div>
    </div>
    <van-button class="button" type="primary" size="large" @click="onButton"
      >立即申请</van-button
    >
  </div>
</template>

<script>
import { applyAuth } from "@/api/tieba-net";
import loading from '@/utils/loading'
import LeftArrow from "@/components/common/LeftArrow.vue";
export default {
  name: "",
  components: { LeftArrow },
  data() {
    return {};
  },
  methods: {
    onButton() {
      this.$dialog
        .confirm({
          title: "申请吧主",
          message: "您确认要申请吧主吗?",
        })
        .then(() => {
          if (this.$route.query.author) {
            this.$toast.fail("该吧已有吧主");
            return;
          }
          if (this.$route.query.level < 3) {
            this.$toast.fail("贴吧等级不足,至少3级！");
            return;
          }
          this.applyMaxAuth();
        })
        .catch(() => {});
    },
    async applyMaxAuth() {
      loading(this)
      try {
        const { status } = await applyAuth(this.$route.query.tiebaId);
        if (status === 401) {
          this.$toast.fail("登入已过期");
          this.$router.replace({ name: "login-user" });
          return;
        }
        if (status !== 200) throw new Error();
        this.$toast.success("恭喜你已成为本吧吧主");
        this.$router.back();
      } catch (err) {
        this.$toast.fail("网络不稳定");
      }
    },
  },
};
</script>
<style lang='less' scoped>
.apply-auth {
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
  .fake-img {
    width: 100%;
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 18px;
    height: 50px;
    img {
      width: 40px;
      height: 35px;
    }
    .right {
      width: 100%;
      height: 70%;
      margin-left: 15px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .bottom {
        font-size: 12px;
        color: rgb(168, 168, 168);
      }
    }
  }
  .button {
    position: absolute;
    width: 90%;
    height: 40px;
    background-color: rgb(97, 160, 255);
    margin-left: 50%;
    border-radius: 40px;
    transform: translateX(-50%);
    bottom: 10px;
    padding: 0 10px;
  }
}
</style>