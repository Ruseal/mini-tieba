<template>
  <div class="placed-top">
    <div @click="onTop">
      {{
        tiebaMsg.maxAuth
          ? "[置顶]&nbsp;&nbsp;欢迎来到本吧！"
          : "[置顶]&nbsp;&nbsp;本吧吧主火热招募中！"
      }}
    </div>
    <div>[公告]&nbsp;&nbsp;立即前往开通贴吧会员</div>
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
    tiebaMsg: {
      type: Object,
      required: true,
    },
  },
  methods: {
    onTop() {
      if (this.tiebaMsg.maxAuth) {
        this.$toast("暂不支持查看置顶贴子详情");
        return;
      }
      this.$router.push({
        name: "apply-auth",
        query: {
          level: this.tiebaMsg.cardMsg.level,
          tiebaId: this.tiebaMsg.id,
          author:this.tiebaMsg.maxAuth
        },
      });
    },
  },
};
</script>
<style lang='less' scoped>
.placed-top {
  width: 100%;
  height: 79px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  padding: 10px;
  background-color: rgb(255, 255, 255);
  div {
    width: 100%;
    height: 25px;
    // background-color: #fff;
    font-size: 12px;
    line-height: 25px;
  }
}
</style>