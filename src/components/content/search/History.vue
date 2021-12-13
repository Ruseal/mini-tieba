<template>
  <div class="history" v-if="statusData === 'ok'">
    <search-type
      v-if="historyList.length"
      @delete="clearHistory"
      :history-list="historyList"
    />
    <search-type
      v-if="foundHistoryList.length"
      :show-delete="false"
      :history-list="foundHistoryList"
    />
    <hot-search v-if="hotSearch" :history-list="hotSearch" />
  </div>
</template>

<script>
import {
  getSearchHistory,
  getFoundHistory,
  getHotSearch,
  clearSearchHistory,
} from "@/api/search-net";
import HotSearch from "./HotSearch.vue";
import SearchType from "./SearchType.vue";
export default {
  name: "",
  components: { SearchType, HotSearch },
  data() {
    return {
      statusData: "error",
      historyList: [],
      foundHistoryList: [],
      hotSearch: [],
      finshInitCount: 0,
    };
  },
  created() {
    this.getSearchHistoryMethod();
    this.getFoundHistoryMethod();
    this.getHotSearchMethod();
  },
  methods: {
    async getSearchHistoryMethod() {
      try {
        const { data, status } = await getSearchHistory();
        if (status === 401) {
          this.statusData = "ok";
          this.historyList = JSON.parse(
            localStorage.getItem("search-history") || "[]"
          );
          this.finshInitCount++;
          return;
        }
        if (status !== 200) throw new Error();
        this.statusData = "ok";
        this.historyList = data;
      } catch (err) {
        this.statusData = "error";
      }
      this.finshInitCount++;
    },
    async getFoundHistoryMethod() {
      try {
        const { data, status } = await getFoundHistory();
        if (status !== 200) throw new Error();
        this.statusData = "ok";
        this.foundHistoryList = data;
      } catch (err) {
        this.statusData = "error";
      }
      this.finshInitCount++;
    },
    async getHotSearchMethod() {
      try {
        const { data, status } = await getHotSearch();
        if (status !== 200) throw new Error();
        this.statusData = "ok";
        this.hotSearch = data;
      } catch (err) {
        this.statusData = "error";
      }
      this.finshInitCount++;
    },
    clearHistory() {
      this.$dialog
        .confirm({
          title: "提示",
          message: "是否清空历史记录?",
        })
        .then(async () => {
          try {
            const { status } = await clearSearchHistory();
            if (status === 401) {
              localStorage.removeItem("search-history");
              this.historyList = [];
              return;
            }
            if (status !== 200) throw new Error();
            this.historyList = [];
          } catch (err) {
            this.$toast.fail("网络错误");
          }
        })
        .catch(() => {});
    },
  },
  watch: {
    finshInitCount(count) {
      if (count >= 3) {
        this.$nextTick(() => {
          this.$emit("fresh-scroll");
        });
      }
    },
  },
};
</script>
<style lang='less' scoped>
</style>