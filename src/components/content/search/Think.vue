<template>
  <div class="think">
    <van-cell-group
      @click="$bus.$emit('change-value', item.name)"
      v-for="item in thinkList"
      :key="item.name"
    >
      <van-cell class="cell" icon="search">
        <div class="item" slot="title" v-html="searchText(item.name)"></div>
      </van-cell>
    </van-cell-group>
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
    thinkList: {
      type: Array,
      default() {
        return [];
      },
    },
    value: {
      type: String,
      default() {
        return "";
      },
    },
  },
  mounted() {
    this.$emit("fresh-scroll");
  },
  destroyed() {
    this.thinkList.splice(0, this.thinkList.length);
  },
  methods: {
    searchText(text) {
      return text.replace(
        new RegExp(this.value, "gi"),
        `<span style="color: red;font-size: .35rem;">${this.value}</span>`
      );
    },
  },
};
</script>
<style lang='less' scoped>
.think {
  /deep/ .van-cell {
    padding: 8px 5px;
  }
  .cell {
    padding-left: 12px;
    .item {
      margin-left: 6px;
      font-size: 13px;
    }
  }
}
</style>