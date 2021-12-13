<template>
  <div class="card-list-item">
    <div class="top" ref="colorRef"></div>
    <div class="bottom">
      <div>{{ tiebaCardItem.tiebaName }}</div>
      <div v-if="!tiebaCardItem.notData">
        关注&nbsp;&nbsp;{{ tiebaCardItem.focusCount }}
      </div>
      <div v-else>您还未留下贴吧足迹</div>
    </div>
    <img
      :src="
        tiebaCardItem.avatar ||
        require('@/assets/img/common/default/tieba_default.png')
      "
      class="avatar"
    />
  </div>
</template>

<script>
export default {
  name: "card-list-item",
  components: {},
  data() {
    return {
      color: [
        "rgb(248, 165, 244)",
        "black",
        "red",
        "rgb(102, 174, 241)",
        "rgb(252, 227, 6)",
        "green",
        "rgb(123, 255, 0)",
      ],
    };
  },
  props: {
    tiebaCardItem: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.$refs.colorRef.style.cssText = `background-color:${
      this.color[~~(Math.random() * 7)]
    } ;`;
    this.$nextTick(() => {
      this.$emit("fresh-scroll");
    });
  },
};
</script>
<style lang='less' scoped>
.card-list-item {
  position: relative;
  margin-left: 10px;
  width: 100px;
  height: 120px;
  display: inline-block;
  border-radius: 5px;
  box-shadow: 0 0px 10px 1px rgb(217, 223, 226);
  .top {
    width: 100%;
    height: 45%;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .bottom {
    width: 100%;
    height: 55%;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: rgb(253, 250, 250);
    div:nth-child(1) {
      font-size: 13px;
      text-align: center;
      transform: translateY(120%);
    }
    div:nth-child(2) {
      font-size: 9px;
      text-align: center;
      color: rgb(114, 114, 114);
      transform: translateY(190%);
    }
  }
  .avatar {
    position: absolute;
    width: 45%;
    height: 35%;
    border-radius: 15px;
    top: 40%;
    left: 50%;
    object-fit: cover;
    object-position: center;
    transform: translate(-50%, -50%);
    border: 2px solid white;
  }
}
</style>