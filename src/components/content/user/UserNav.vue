<template>
  <div class="user-nav">
    <van-nav-bar>
      <img
        class="icon-scanning"
        slot="left"
        src="@/assets/img/user/user_nav/scanning.png"
        @click="onScanning"
      />
      <div class="title" slot="title">我的</div>
      <div slot="right">
        <img
          class="icon-dress-up"
          src="@/assets/img/user/user_nav/dress_up.png"
          alt=""
          @click="onDressUp"
        />
        <img
          class="icon-setting"
          src="@/assets/img/user/user_nav/setting.png"
          alt=""
          @click="onSetting"
        />
      </div>
    </van-nav-bar>
  </div>
</template>

<script>
export default {
  name: "user-nav",
  components: {},
  data() {
    return {};
  },
  methods: {
    onScanning() {
      this.$toast("点击了扫描");
    },
    onDressUp() {
      this.$toast("点击了装扮");
    },
    onSetting() {
      this.$router.push('/setting')
    },
  },
};
</script>
<style lang='less' scoped>
.user-nav {
  .title {
    letter-spacing: 2px;
    font-size: 15px;
  }
  img {
    width: 25px;
    height: 23px;
    transform: translateY(10%);
  }
  img:nth-child(1) {
    margin-right: 20px;
  }
  .icon-scanning {
    width: 22px;
    height: 22px;
    transform: unset;
  }
}
</style>