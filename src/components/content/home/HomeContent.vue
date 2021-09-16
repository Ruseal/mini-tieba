<template>
  <div class="home-content">
    <van-pull-refresh
      v-model="isLoading"
      :head-height="100"
      @refresh="onRefresh"
      :disabled="isPullDownDisabled"
    >
      <!-- 下拉提示，通过 scale 实现一个缩放效果 -->
      <img
        class="huaji"
        slot="pulling"
        slot-scope="props"
        src="../../../assets/img/home/pulldownhuaji.png"
        :style="{ transform: `scale(${props.distance / 80})` }"
      />
      <!-- 释放提示 -->
      <img
        class="huaji"
        slot="loosing"
        src="../../../assets/img/home/pulldownhuaji.png"
      />
      <!-- 加载提示 -->
      <img
        class="huaji"
        slot="loading"
        src="../../../assets/img/home/pulldownhuaji.png"
      />
      <div v-for="(item, index) in articleList" :key="index" class="div-test">
        {{ 11 }}
      </div>
      <div class="pullup-style">
        {{ isArticleHasValue ? "正在加载..." : "没有更多了" }}
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      count: 0,
      isLoading: false,
    };
  },
  props: {
    articleList: {
      type: Array,
      required: true,
    },
    isPullDownDisabled: {
      type: Boolean,
      default() {
        return false;
      },
    },
    isArticleHasValue: {
      type: Boolean,
      required: true,
    },
  },
  mounted() {
    this.createdDomHandle();
    console.log(this.articleList);
  },
  methods: {
    createdDomHandle() {},
    onRefresh() {
      setTimeout(() => {
        this.isLoading = false;
        this.$emit("fresh-success", true);
        setTimeout(() => {
          this.$emit("fresh-success", false);
        }, 2000);
      }, 2000);
    },
  },
};
</script>
<style lang='less' scoped>
.home-content {
  .huaji {
    position: absolute;
    width: 30px;
    height: 30px;
    top: 50%;
    margin-left: -15px;
    transform: translateY(-50%);
  }
  .pull-refresh-success {
    width: 100%;
    height: 30px;
    font-size: 12px;
    background-color: rgb(88, 104, 252);
    color: white;
    text-align: center;
    line-height: 30px;
  }
  .div-test {
    width: 100%;
    height: 300px;
    background-color: rgb(175, 90, 90);
    margin-bottom: 10px;
  }
  .pullup-style {
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: #fff;
  }
}
</style>