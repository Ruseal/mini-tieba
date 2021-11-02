<template>
  <div class="reply-wrapper">
    <slot name="label"></slot>
    <div class="reply-content">{{ replyData.content }}</div>
    <div class="Belongs" @click="toDetail">
      <div>
        {{ replyData.article.text }}
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
    replyData: {
      type: Object,
      require: true,
    },
  },
  methods: {
    toDetail() {
      this.$router.push({
        name: "detail",
        params: { id: this.replyData.article.id },
      });
    },
  },
};
</script>
<style lang='less' scoped>
.reply-wrapper {
  width: 100%;
  padding: 10px;
  background-color: #fff;
  margin-bottom: 6px;
  .reply-content {
    margin-top: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    display: -moz-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-size: 14px;
    letter-spacing: 2px;
    font-weight: 550;
  }
  .Belongs {
    margin-top: 10px;
    width: 100%;
    height: 50px;
    padding: 10px 8px;
    background-color: rgb(238, 238, 238);
    div {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      display: -moz-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      font-size: 13px;
    }
  }
}
</style>