<template>
  <div class="scroll" ref="scrollDom">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  name: "scroll",
  components: {},
  data() {
    return {
      bs: null,
    };
  },
  props: {
    probeType: {
      type: Number,
      default() {
        return 0;
      },
    },
    pullUpLoad: {
      type: Boolean,
      default() {
        return false;
      },
    },
    bounce: {
      type: Boolean,
      default() {
        return false;
      },
    },
    click: {
      type: Boolean,
      default() {
        return false;
      },
    },
    stopPropagation: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  mounted() {
    this.initBScroll();
  },
  methods: {
    initBScroll() {
      this.bs = new BScroll(this.$refs.scrollDom, {
        click: this.click,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad,
        bounce: this.bounce,
      });
      this.bs &&
        this.bs.on("scroll", (position) => {
          this.$emit("scrollPosition", position);
        });
      this.bs &&
        this.pullUpLoad &&
        this.bs.on("pullingUp", () => {
          this.$emit("pullingUp");
        });
      this.bs && this.bs.hooks.on("enable", () => {});
      this.bs && this.bs.on("disable", () => {});
    },
    scrollTo(x, y, time = 500) {
      this.bs && this.bs.scrollTo(x, y, time);
    },
    finishPullUp() {
      this.bs && this.bs.finishPullUp();
    },
    refresh() {
      this.bs && this.bs.refresh();
    },
    getScrollY() {
      return this.bs ? this.bs.y : 0;
    },
  },
};
</script>
<style lang='less' scoped>
.scroll {
  overflow: hidden;
}
</style>