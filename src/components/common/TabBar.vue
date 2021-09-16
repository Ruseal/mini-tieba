<template>
  <div class="tab-bar">
    <van-tabbar
      v-model="active"
      active-color="#59b9f5"
      inactive-color="#858585"
      route
    >
      <van-tabbar-item
        v-for="(item, index) in icon"
        :key="index"
        :to="{ name: item.path }"
      >
        <span class="tabbar-font">{{ item.title }}</span>
        <img
          class="tabbar-icon"
          slot="icon"
          slot-scope="props"
          :src="props.active ? item.active : item.inactive"
        />
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      isnight: false,
      active: 0,
      icon: [
        {
          title: "首页",
          path: "home",
          active: require("@/assets/img/tabbar/home_active.png"),
          inactive: require("@/assets/img/tabbar/home.png"),
        },
        {
          title: "进吧",
          path: "come",
          active: require("@/assets/img/tabbar/come_active.png"),
          inactive: require("@/assets/img/tabbar/come.png"),
        },
        {
          title: "频道",
          path: "channel",
          active: require("@/assets/img/tabbar/channel_active.png"),
          inactive: require("@/assets/img/tabbar/channel.png"),
        },
        {
          title: "消息",
          path: "notice",
          active: require("@/assets/img/tabbar/notice_active.png"),
          inactive: require("@/assets/img/tabbar/notice.png"),
        },
        {
          title: "我的",
          path: "user",
          active: require("@/assets/img/tabbar/user_active.png"),
          inactive: require("@/assets/img/tabbar/user.png"),
        },
      ],
    };
  },
};
</script>
<style lang='less' scoped>
.tab-bar {
  .van-tabbar {
    box-shadow: 0px -1px 1px rgba(110, 104, 109, 0.04);
  }
  .van-tabbar,
  .van-tabbar-item--active {
    background-color: #ffffff;
  }
  .tabbar-font {
    font-size: 12px;
  }
  .tabbar-icon {
    width: 27px;
    height: 27px;
  }
}
</style>