<template>
  <div class="detail-nav">
    <van-nav-bar>
      <div slot="left"><slot name="left"></slot></div>
      <div slot="title" class="center">
        <img class="avatar" :src="navData.avatar?navData.avatar:require('@/assets/img/common/user-avatar/b.jpg')" alt="" />
        <div>{{ navData.title }}</div>
      </div>
      <img class="right" slot="right" src="@/assets/img/common/point.png" />
    </van-nav-bar>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {};
  },
  props: {
    navData: {
      type: Object,
      default() {
        return {
          avatar: require("@/assets/img/common/user-avatar/b.jpg"),
          title: "贴吧名",
        };
      },
    },
  },
};
</script>
<style lang='less' scoped>
.detail-nav {
  .center {
    display: flex;
    align-items: center;
    .avatar {
      width: 27px;
      height: 25px;
      object-position: center;
      object-position: center;
      border-radius: 9px;
      margin-right: 8px;
    }
  }
  .right {
    width: 17px;
    height: 15px;
  }
}
</style>