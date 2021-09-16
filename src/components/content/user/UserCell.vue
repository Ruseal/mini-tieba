<template>
  <div class="query-cell">
    <van-cell
      class="cell"
      is-link
      center
      v-for="(item, index) in cellList"
      :key="index"
      :border="false"
    >
      <img slot="icon" :src="item.image" />
      <div class="collection-title" slot="title">{{ item.title }}</div>
    </van-cell>
    <div v-show="lastLine" class="line"></div>
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
    cellList: {
      type: Array,
      required: true,
    },
    lastLine: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
};
</script>
<style lang='less' scoped>
.query-cell {
  margin-top: 10px;
  .cell {
    img {
      width: 25px;
      height: 25px;
      margin-right: 10px;
    }
  }
  .line {
    margin-top: 10px;
    border-top: 1px solid #f1ecec;
  }
}
</style>