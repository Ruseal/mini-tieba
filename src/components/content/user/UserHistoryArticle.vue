<template>
  <div class="user-history-article" @click="toDetail">
    <div>{{ historyItem.title ? historyItem.title : historyItem.text }}</div>
    <div class="button">
      <div>{{ historyItem.tiebaName }}吧</div>
      <div>{{ getTimeDifference(historyItem.createTime) }}</div>
    </div>
  </div>
</template>

<script>
import timeDifference from "@/utils/time-difference";
export default {
  name: "",
  components: {},
  data() {
    return {};
  },
  computed: {
    getTimeDifference() {
      return (time) => {
        return timeDifference(time);
      };
    },
  },
  props: {
    historyItem: {
      type: Object,
      required: true,
    },
  },
  methods: {
    toDetail() {
      console.log(this.historyItem);
      this.$router.push({
        name: "detail",
        params: {
          id: this.historyItem.id,
          tiebaName: this.historyItem.tiebaName,
          tiebaAvatar:this.historyItem.avatar,
          from: this.$route.name,
        },
      });
    },
  },
};
</script>
<style lang='less' scoped>
.user-history-article {
  background-color: #fff;
  border-bottom: 3px solid rgba(240, 239, 239, 0.3);
  padding: 5px 15px;
  .button {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    div:nth-child(1) {
      font-size: 11px;
      color: rgb(151, 151, 151);
    }
    div:nth-child(2) {
      font-size: 13px;
      color: rgb(151, 151, 151);
    }
  }
}
</style>