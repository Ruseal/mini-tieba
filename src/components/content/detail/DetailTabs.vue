<template>
  <div class="detail-tabs">
    <div class="left">
      <div
        v-for="(tabText, index) in tabTitleList"
        class="tab"
        :style="index === tabCurrentIndex ? { color: 'black' } : ''"
        :key="index"
        @click="onTab(index)"
      >
        <span>{{ tabText }}</span>
        <div :class="{ line: index === tabCurrentIndex }"></div>
      </div>
    </div>
    <div class="right">
      <div class="wrapper">
        <p @click="onHot">热门</p>
        <p @click="onAsc">正序</p>
        <p @click="onDesc">倒序</p>
      </div>
      <div class="slide" ref="slideRef" />
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      tabTitleList: ["全部回复", "只看楼主"],
      tabCurrentIndex: 0,
    };
  },
  methods: {
    onTab(index) {
      this.$emit("on-tab", index);
      this.tabCurrentIndex = index;
    },
    onHot() {
      this.$refs.slideRef.style.cssText = "left:0;";
    },
    onAsc() {
      this.$refs.slideRef.style.cssText = "left:33%;";
      this.$toast('暂不支持排序')
    },
    onDesc() {
      this.$refs.slideRef.style.cssText = "left:66%;";
      this.$toast('暂不支持排序')
    },
  },
};
</script>
<style lang='less' scoped>
.detail-tabs {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 0 10px;
  background-color: #fff;
  .left {
    display: flex;
    justify-content: space-between;
    width: 40%;
    height: 100%;
    .tab {
      height: 100%;
      line-height: 40px;
      font-size: 14px;
      color: rgb(58, 58, 58);
      letter-spacing: 2px;
    }
    .line {
      width: 50%;
      margin-left: 25%;
      margin-top: -2px;
      border-bottom: 2px solid black;
    }
  }

  .right {
    position: relative;
    width: 38%;
    height: 65%;
    right: 0;
    border-radius: 30px;
    background-color: rgb(243, 243, 243);
    .wrapper {
      position: absolute;
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      height: 100%;

      p {
        position: relative;
        color: rgb(131, 131, 131);
        font-size: 13px;
        z-index: 99;
      }
    }
    .slide {
      position: absolute;
      width: 45px;
      height: 23px;
      top: 50%;
      transform: translateY(-50%);
      transition: 0.2s;
      border: 1px solid rgb(223, 221, 221);
      border-radius: 15px;
      background-color: white;
      z-index: 5;
    }
  }
}
</style>