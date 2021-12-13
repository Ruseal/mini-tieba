<template>
  <div class="search-cell">
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
      <div class="middle">
        {{
          cellType === "tieba"
            ? "简介:" + dataList.introduction
            : "贴吧ID:&nbsp;" + dataList.id
        }}
      </div>
      <div class="botton">
        {{
          cellType === "tieba"
            ? "关注&nbsp;" +
              dataList.focusCount +
              "&nbsp;&nbsp;&nbsp;" +
              "贴子&nbsp;" +
              dataList.commentCount
            : "粉丝&nbsp;&nbsp;" + dataList.focus
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
        `<span style="color: red;font-size: 0.4rem;">${this.value}</span>`
      );
    },
  },
};
</script>
<style lang='less' scoped>
.search-cell {
  display: flex;
  align-items: center;
  img {
    // flex: 1;
    width: 62px;
    height: 60px;
    border-radius: 30px;
    object-fit: cover;
    object-position: center;
    margin-right: 10px;
  }
  .avatar-active {
    border-radius: 20px;
    margin-right: 15px;
  }
  .center {
    flex: 5;
    .top {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 5px;
    }
    .middle,
    .botton {
      margin-top: 2px;
      width: 200px;
      font-size: 10px;
      color: rgb(161, 161, 161);

      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .right {
    flex: 1;
    .buttom {
      width: 60px;
      height: 26px;
      border-radius: 13px;
      text-align: center;
      line-height: 26px;
      font-size: 13px;
      color: rgb(156, 16, 250);
      background-color: rgb(233, 227, 255);
    }
  }
}
</style>