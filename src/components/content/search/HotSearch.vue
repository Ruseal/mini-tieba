<template>
  <div class="hot-search">
    <div class="title">热搜榜</div>
    <div class="cell-wrap">
      <div
        class="cell-item"
        @click="$bus.$emit('change-value', item.name)"
        v-for="(item, index) in historyList"
        :key="item.name"
      >
        <div class="rank-logo">{{ index + 1 }}</div>
        <div class="name">{{ item.name }}</div>
        <div class="hot-count">
          <img src="@/assets/img/common/hot-icon.png" alt="" />{{
            item.hot
          }}
        </div>
      </div>
    </div>
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
    historyList: {
      type: Array,
      required: true,
    },
  },
};
</script>
<style lang='less' scoped>
.hot-search {
  width: 95vw;
  border-radius: 15px;
  clear: left;
  margin: 0 auto;
  padding: 10px;
  background-color: #fff;
  .title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 15px;
  }
  .cell-wrap {
    padding: 0 5px;
    .cell-item {
      display: flex;
      align-items: center;
      height: 45px;
      border-bottom: 1px solid rgb(236, 236, 236);
      .rank-logo {
        width: 17px;
        height: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        font-size: 11px;
        color: white;
        background-color: rgb(201, 201, 201);
        margin-right: 15px;
      }
      &:nth-child(1) .rank-logo {
        background-color: rgb(247, 47, 20);
      }
      &:nth-child(2) .rank-logo {
        background-color: rgb(253, 110, 14);
      }
      &:nth-child(3) .rank-logo {
        background-color: rgb(248, 186, 14);
      }
      .name {
        flex: 3;
        font-size: 13px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .hot-count {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        color: #8a8a8a;
        img {
          margin-right: 3px;
          width: 16px;
          height: 16px;
        }
      }
      &:last-child {
        border-bottom: unset;
      }
    }
  }
}
</style>