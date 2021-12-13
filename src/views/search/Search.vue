<template>
  <div class="search-page">
    <form action="/">
      <van-search
        v-model="value"
        show-action
        placeholder="请输入搜索关键词"
        background="rgb(239, 243, 243)"
        shape="round"
        @input="valueChange"
        @focus="isShowSearchList = false"
        @search="onSearch"
        @cancel="$router.back()"
      />
    </form>
    <scroll class="scroll" click ref="scrollRef">
      <search-list
        v-if="isShowSearchList"
        :value="value"
        @fresh-scroll="freshScroll"
      />
      <think
        v-else-if="value.trim()"
        :value="value"
        :think-list="thinkList"
        @fresh-scroll="freshScroll"
      />
      <history v-else @fresh-scroll="freshScroll" />
    </scroll>
  </div>
</template>

<script>
import {
  getSearchThink,
  saveHistory,
  addHistoryCount,
} from "@/api/search-net";
import debounce from "@/utils/debounce";
import Scroll from "@/components/common/Scroll.vue";
import History from "@/components/content/search/History.vue";
import SearchList from "@/components/content/search/SearchList.vue";
import Think from "@/components/content/search/Think.vue";
export default {
  name: "search",
  components: { Scroll, History, SearchList, Think },
  data() {
    return {
      value: "",
      isShowSearchList: false,
      debounce: null,
      dealy: 500,
      thinkList: [],
    };
  },
  created() {
    this.createInit();
  },
  destroyed() {
    this.$bus.$off("change-value", this.changeValue);
  },
  methods: {
    createInit() {
      this.debounce = debounce(this.getThinkList, this.dealy);
      this.$bus.$on("change-value", this.changeValue);
    },
    onSearch() {
      if (!this.value.trim()) return;
      this.isShowSearchList = true;
      this.saveHistoryMethod();
    },
    freshScroll() {
      this.$refs.scrollRef.refresh();
    },
    valueChange() {
      if (!this.value.trim()) return;
      this.thinkList = [];
      this.debounce();
    },
    async getThinkList() {
      try {
        const { status, data } = await getSearchThink(this.value);
        if (status !== 200) throw new Error();
        this.thinkList = data;
      } catch (err) {
        this.$toast.fail("网络错误");
      }
    },
    async saveHistoryMethod() {
      try {
        const { status } = await saveHistory(this.value);
        if (status === 401) {
          await this.addHistoryCount();
          return;
        }
        if (status !== 200) throw new Error();
      } catch (err) {
        this.$toast.fail("网络错误");
      }
    },
    async addHistoryCount() {
      try {
        const { status } = await addHistoryCount(this.value);
        if (status !== 200) throw new Error();
        const historyList = JSON.parse(
          localStorage.getItem("search-history") || "[]"
        );
        let index = historyList.findIndex((item) => item.name === this.value);
        if (index === -1) {
          historyList.unshift({ name: this.value });
        } else {
          historyList.unshift(historyList.splice(index, 1)[0]);
        }
        localStorage.setItem("search-history", JSON.stringify(historyList));
      } catch (err) {
        this.$toast.fail("网络错误");
      }
    },
    changeValue(value) {
      this.value = value;
      this.onSearch();
    },
  },
};
</script>
<style lang='less' scoped>
.search-page {
  height: 100vh;
  background-color: rgb(239, 243, 243);
  .scroll {
    width: 100vw;
    height: calc(100vh - 55px);
  }
}
</style>