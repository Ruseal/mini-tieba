<template>
  <div class="search-cell-item">
    <img
      :class="{ 'avatar-active': cellType === 'tieba' }"
      :src="
        dataList.avatar_url
          ? dataList.avatar_url
          : cellType === 'tieba'
          ? require('@/assets/img/common/default/tieba_default.png')
          : require('@/assets/img/common/default/user_default.jpg')
      "
      alt=""
    />
    <div class="center">
      <div class="top" v-html="searchText(dataList.name)"></div>
      <div class="botton">
        {{
          cellType === "tieba"
            ? "关注&nbsp;" +
              dataList.focusCount +
              "&nbsp;&nbsp;&nbsp;" +
              "贴子&nbsp;" +
              dataList.commentCount
            : "贴吧ID:&nbsp;" +
              dataList.id +
              "&nbsp;&nbsp;&nbsp;" +
              "粉丝&nbsp;&nbsp;" +
              dataList.focus
        }}
      </div>
    </div>
    <div class="right">
      <div @click="searchCellRouter" class="buttom">
        {{ cellType === "tieba" ? "进入" : "查看" }}
      </div>
    </div>
  </div>
</template>

<script>
import mixins from "@/mixins/mixin";
export default {
  name: "",
  components: {},
  mixins: [mixins],
  data() {
    return {};
  },
  props: {
    cellType: {
      type: String,
      // user or tieba
      default() {
        return "user";
      },
    },
    dataList: {
      type: Object,
      default() {
        return {};
      },
    },
    value: {
      type: String,
      default() {
        return "";
      },
    },
  },
  methods: {
    searchText(text) {
      return text.replace(
        new RegExp(this.value, "gi"),
        `<span style="color: red;font-size: .38rem;">${this.value}</span>`
      );
    },
  },
};
</script>
<style lang='less' scoped>
.search-cell-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2px;
  margin-top: 15px;
  img {
    flex: 1;
    width: 42px;
    height: 40px;
    border-radius: 20px;
    object-fit: cover;
    object-position: center;
    margin-right: 5px;
    margin-right: 15px;
  }
  .avatar-active {
    border-radius: 15px;
    margin-right: 10px;
  }
  .center {
    flex: 5;
    .top {
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 3px;
    }
    .botton {
      font-size: 10px;
      color: rgb(161, 161, 161);
    }
  }
  .right {
    flex: 2;
    display: flex;
    flex-direction: row-reverse;
    .buttom {
      width: 55px;
      height: 25px;
      border-radius: 13px;
      text-align: center;
      line-height: 25px;
      font-size: 12px;
      color: rgb(156, 16, 250);
      background-color: rgb(233, 227, 255);
    }
  }
}
</style>