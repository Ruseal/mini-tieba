<template>
  <div class="tabs">
    <div class="tab">
      <div
        class="tab-item"
        :class="{ 'tab-item-active': index === active }"
        @click="tabClick(index)"
        v-for="(item, index) in tabList"
        :key="index"
        ref="tabItemRef"
      >
        {{ item }}
      </div>
      <div class="border" ref="borderRef"></div>
    </div>
    <div class="placeholder" />
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      interval: 0,
      active: 1,
    };
  },
  props: {
    tabList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  mounted() {
    this.initDom();
  },
  methods: {
    getWidth() {
      let width = 0;
      switch (this.active) {
        case 0:
          width = 10;
          break;
        case 1:
          width = 30;
          break;
        case 2:
          width = 50;
          break;
        case 3:
          width = 70;
          break;
        case 4:
          width = 90;
          break;
        default:
      }
      return width;
    },
    initDom() {
      try {
        if (this.tabList.length !== 5)
          throw new Error("私有组件,tabList数组长度必须为5");
        this.$refs.borderRef.style.left = `${this.getWidth()}%`;
      } catch (error) {
        console.error(error);
      }
    },
    tabClick(index) {
      this.$emit("click", index);
      this.$refs.borderRef.style.left = `${this.getWidth()}%`;
    },
  },
};
</script>
<style lang='less' scoped>
.tabs {
  width: 100vw;
  height: 44px;
  display: flex;
  border-bottom: 1px solid rgb(248, 246, 246);
  .tab {
    flex: 7;
    position: relative;
    height: 44px;
    display: flex;
    text-align: center;
    align-items: center;
    .tab-item {
      flex: 1;
      height: 44px;
      line-height: 44px;
    }
    .tab-item-active {
      font-weight: 700;
    }
    .border {
      position: absolute;
      height: 4px;
      border-radius: 2px;
      bottom: -2px;
      width: 21px;
      transform: translateX(-50%);
      transition: 0.2s;
      background-color: rgb(19, 71, 243);
      z-index: 10;
    }
  }
  .placeholder {
    flex: 2;
    height: 100%;
  }
}
</style>