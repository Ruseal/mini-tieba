<template>
  <div class="query-cell">
    <van-cell
      class="cell"
      is-link
      center
      v-for="(item, index) in cellList"
      :key="index"
      :border="false"
      @click="toUserCell(item)"
    >
      <img slot="icon" :src="item.image" />
      <div class="collection-title" slot="title">{{ item.title }}</div>
    </van-cell>
    <div v-show="lastLine" class="line"></div>
  </div>
</template>

<script>
import { getUserMessage } from "@/api/user-net";
export default {
  name: "",
  components: {},
  data() {
    return {
      userMsg: null,
    };
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
  methods: {
    async toUserCell(item) {
      switch (item.title) {
        case "我的收藏":
          this.$router.push({
            name: "user-star",
            query: {
              type: item.title,
            },
          });
          break;
        case "浏览历史":
          this.$router.push({
            name: "user-history",
          });
          break;
        case "会员中心":
          if (!(await this.getUserMsgMethod())) return;
          this.$router.push({
            name: "user-member",
            query: { userMsg: this.userMsg },
          });
          break;
        default:
          this.$router.push({
            name: "empty",
            query: { name: item.title },
          });
          break;
      }
    },
    async getUserMsgMethod() {
      try {
        const { status, data } = await getUserMessage();
        if (status === 401) {
          this.$toast("登入后查看会员");
          return;
        }
        if (status !== 200) throw new Error();
        this.userMsg = data;
        
        return true;
      } catch (err) {
        this.$toast.fail("网络错误");
      }
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