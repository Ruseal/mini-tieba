<template>
  <div class="search-list">
    <div class="tabs">
      <div
        class="tabs-item"
        @click="toggleTab(index)"
        v-for="(item, index) in tabs"
        :key="index"
      >
        {{ item }}
        <div class="border" :class="{ active: currentTab === index }" />
      </div>
    </div>

    <div
      class="container-main"
      v-if="
        ['tieba', 'user'].includes(cellType) &&
        currentList[0] &&
        currentList[0].name === this.value
      "
    >
      <search-cell
        :value="value"
        :cell-type="cellType"
        :data-list="currentList[0]"
      />
    </div>
    <div v-else>
      <div class="not-find-tieba" v-show="cellType === 'tieba'">
        <div class="text">
          没有找到"<span style="color: red; font-size: 0.33rem">{{
            value
          }}</span
          >"吧
        </div>
        <div class="create" @click="$router.push({ name: 'create-tieba' })">
          +&nbsp;创建吧
        </div>
      </div>
      <div class="not-find-user" v-show="cellType === 'user'">
        你搜索的用户不存在
      </div>
    </div>

    <div
      class="container-related"
      v-if="
        ['tieba', 'user'].includes(cellType) &&
        currentList.length &&
        newCurrentList.length
      "
    >
      <div class="related-title">
        {{ cellType === "tieba" ? "你可能感兴趣的吧" : "你可能想认识的用户" }}
      </div>
      <search-cell-item
        v-for="item in newCurrentList"
        :key="item.name"
        :data-list="item"
        :cell-type="cellType"
        :value="value"
      />
    </div>

    <div class="article-list" v-if="cellType === 'article'">
      <scroll
        class="scroll"
        pullUpLoad
        @pullingUp="pullUpFresh"
        click
        ref="searchScrollRef"
      >
        <article-item
          v-for="item in currentList"
          :key="item.id"
          :article-item="item"
          label-right-child=""
          :value="value"
          @image-load="freshScrollMethod"
        />
        <div class="pullup-style" v-if="currentList.length">
          {{ isNotData ? "没有更多了" : "正在加载..." }}
        </div>
        <div v-else class="not-find-user">没有找到你想要找的贴子</div>
      </scroll>
    </div>
  </div>
</template>

<script>
import { getSearchList, getSearchArticleList } from "@/api/search-net";
import debounce from "@/utils/debounce";
import ArticleItem from "../../common/ArticleItem.vue";
import Scroll from "../../common/Scroll.vue";
import SearchCell from "./SearchCell.vue";
import SearchCellItem from "./SearchCellItem.vue";
export default {
  name: "search-list",
  components: { ArticleItem, SearchCell, SearchCellItem, Scroll },
  data() {
    return {
      tabs: ["吧", "人", "贴", ""],
      currentTab: 0,
      cellType: "tieba",
      searchList: {},
      currentList: [],
      freshScroll: null,
      size: 5,
      offset: 0,
      isNotData: false,
    };
  },
  props: {
    value: {
      type: String,
      default() {
        return "";
      },
    },
  },

  created() {
    this.getSearchListMethod();
  },
  computed: {
    newCurrentList() {
      if (this.currentList[0].name === this.value) {
        return this.currentList.slice(1);
      }
      return this.currentList;
    },
  },
  methods: {
    async toggleTab(index) {
      if (this.currentTab === index) return;
      this.currentTab = index;
      this.currentList = [];
      switch (this.currentTab) {
        case 0:
          this.cellType = "tieba";
          this.currentList = this.searchList["tieba"];
          break;
        case 1:
          this.cellType = "user";
          this.currentList = this.searchList["user"];
          break;
        case 2:
          this.cellType = "";
          this.isNotData = false;
          this.offset = 0;
          await this.getSearchArticleListMethod();
          this.cellType = "article";
          this.$nextTick(() => {
            this.freshScroll = debounce(
              this.$refs.searchScrollRef.refresh,
              100
            );
          });
          break;
        default:
      }
      this.$nextTick(() => {
        this.$emit("fresh-scroll");
      });
    },
    async getSearchListMethod() {
      try {
        const { status, data } = await getSearchList(this.value);
        if (status !== 200) throw new Error();
        this.searchList = data;
        this.currentList = this.searchList["tieba"];
        this.$nextTick(() => {
          this.$emit("fresh-scroll");
        });
      } catch (error) {
        this.$toast.fail('网络错误')
      }
    },
    async getSearchArticleListMethod(pull = "") {
      try {
        const { status, data } = await getSearchArticleList(
          this.value,
          this.offset,
          this.size
        );
        if (status !== 200) throw new Error();
        if (!data.length) {
          this.isNotData = true;
          return;
        }
        if (pull !== "pull") {
          this.currentList = data;
          if (this.size > data.length) {
            this.isNotData = true;
          }
          return;
        }
        this.currentList.push(...data);
        this.freshScrollMethod();
        this.$nextTick(() => {
          this.$refs.searchScrollRef.finishPullUp();
        });
      } catch (err) {
        this.$toast.fail('网络错误')
      }
    },
    freshScrollMethod() {
      this.freshScroll();
    },
    pullUpFresh() {
      this.offset += 5;
      setTimeout(() => {
        this.getSearchArticleListMethod("pull");
      }, 1000);
    },
  },
};
</script>
<style lang='less' scoped>
.search-list {
  padding-bottom: 5px;
  .tabs {
    display: flex;
    align-items: center;
    text-align: center;
    width: 100vw;
    height: 30px;
    .tabs-item {
      flex: 1;
      position: relative;
      .border {
        position: absolute;
        bottom: -6px;
        margin-left: 50%;
        transform: translateX(-50%);
        width: 35%;
        height: 3px;
        border-radius: 1.5px;
        z-index: 20;
      }
      .active {
        background-color: rgb(7, 11, 252);
      }
      &:last-child {
        flex: 4;
      }
    }
  }
  .container-main {
    width: 95vw;
    border-radius: 15px;
    padding: 15px 10px;
    margin: 10px auto;
    box-shadow: 0 5px 5px 1px rgb(206, 206, 206);
    background-color: #fff;
  }
  .not-find-tieba {
    width: 95vw;
    border-radius: 15px;
    padding: 15px 10px;
    margin: 10px auto;
    box-shadow: 0 5px 5px 1px rgb(206, 206, 206);
    background-color: #fff;
    .text {
      font-size: 13px;
    }
    .create {
      margin-top: 10px;
      width: 65px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 11px;
      background-color: rgb(214, 220, 231);
      font-size: 10px;
      color: rgb(60, 60, 235);
    }
  }
  .not-find-user {
    margin: 20px 0;
    text-align: center;
    font-size: 13px;
  }
  .container-related {
    width: 95vw;
    border-radius: 15px;
    padding: 10px;
    margin: 10px auto;
    box-shadow: 0 -5px 5px 0px rgb(233, 233, 233);
    background-color: #fff;
    .related-title {
      font-weight: 600;
      margin-bottom: 15px;
    }
  }
  .article-list {
    .scroll {
      position: fixed;
      width: 100vw;
      height: calc(100vh - 30px - 55px);
    }
    .pullup-style {
      width: 100%;
      height: 30px;
      margin-top: -5px;
      font-size: 13px;
      line-height: 30px;
      text-align: center;
      background-color: #fff;
    }
  }
}
</style>