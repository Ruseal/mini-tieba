<template>
  <div class="user-history">
    <van-nav-bar title="浏览历史" @click-right="clearHistory">
      <left-arrow slot="left" @click.native="$router.back()" />
      <div slot="right" class="edit">清空</div>
    </van-nav-bar>
    <loading v-if="statusData === 'loading'" />
    <error v-else-if="statusData === 'error'" />
    <scroll v-else class="scroll" click>
      <user-history-article
        v-for="item in historyList"
        :history-item="item"
        :key="item.id"
      />
    </scroll>
  </div>
</template>

<script>
import { getRecordHistory, clearUserHistory } from "../../../api/user-net";
import Error from "../../../components/common/Error.vue";
import LeftArrow from "../../../components/common/LeftArrow.vue";
import Loading from "../../../components/common/Loading.vue";
import Scroll from "../../../components/common/Scroll.vue";
import UserHistoryArticle from "../../../components/content/user/UserHistoryArticle.vue";
export default {
  name: "user-history",
  components: { LeftArrow, Scroll, Loading, Error, UserHistoryArticle },
  data() {
    return {
      statusData: "loading",
      historyList: null,
    };
  },
  created() {
    this.getRecordHistoryMethod();
  },
  methods: {
    async getRecordHistoryMethod() {
      try {
        const { status, data } = await getRecordHistory();
        if (status !== 200) throw new Error();
        this.historyList = data;
        this.statusData = "ok";
        console.log(data);
      } catch (error) {
        this.statusData = "error";
      }
    },
    clearHistory() { 
      if (!Object.keys(this.historyList).length) {
        this.$toast("暂无历史记录");
        return;
      }
      this.$dialog
        .confirm({
          message: "您确认要删除所有的浏览历史？",
        })
        .then(() => {
          this.clearUserHistoryMethod();
        })
        .catch(() => {});
    },
    async clearUserHistoryMethod() {
      try {
        const { status } = await clearUserHistory();
        if (status !== 200) throw new Error();
        this.getRecordHistoryMethod();
      } catch (error) {
        this.$toast.fail("网络错误，请重新尝试！");
      }
    },
  },
};
</script>
<style lang='less' scoped>
.user-history {
  /deep/.van-nav-bar__title {
    font-size: 14px;
  }
  .scroll {
    width: 100vw;
    height: calc(100vh - 46px);
  }
}
</style>