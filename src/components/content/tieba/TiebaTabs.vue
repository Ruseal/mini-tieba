<template>
  <div class="tabs">
    <div
      v-for="(item, index) in ['热门', '精华']"
      :key="index"
      @click="onTab(index)"
    >
      <div class="title" :class="{ active: active === index }">{{ item }}</div>
      <div v-show="active === index" class="line" />
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      active: 0,
    };
  },
  methods: {
    onTab(index) {
      this.active = index;
    },
  },
};
</script>
<style lang='less' scoped>
.tabs {
  display: flex;
  width: 100%;
  height: 35px;
  padding: 0 10px;
  background-color: rgb(255, 255, 255);
  div {
    position: relative;
    width: 30px;
    height: 100%;
    margin-right: 25px;
    .title {
      text-align: center;
      margin-top: 7px;
      font-size: 13px;
    }
    .active {
      font-weight: 600;
      font-size: 14px;
      margin-top: 5px;
    }
    .line {
      position: absolute;
      width: 50%;
      height: 2.8px;
      left: 50%;
      transform: translateX(-50%);
      bottom: 5px;
      border-radius: 1px;
      background-color: rgb(0, 0, 0);
    }
  }
}
</style>