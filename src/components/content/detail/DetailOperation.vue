<template>
  <div class="detail-operation">
    <div>
      <img src="@/assets/img/detail/wx.png" alt="" />
      <p>微信好友</p>
    </div>
    <div>
      <img src="@/assets/img/detail/qq.png" alt="" />
      <p>QQ好友</p>
    </div>
    <div>
      <img
        @click="articleLikeHandle('sync-d')"
        class="icon"
        :src="isLikeOperation"
        alt=""
      />
      <p>{{ likeCountHandle }}</p>
    </div>
    <div>
      <img class="icon" src="@/assets/img/detail/unlove.png" alt="" />
      <p>踩</p>
    </div>
  </div>
</template>

<script>
import mixins from "../../../mixins/mixin";
export default {
  name: "",
  components: {},
  data() {
    return {};
  },
  mixins: [mixins],
  props: {
    articleItem: {
      type: Object,
      required: true,
    },
  },
  computed: {
    likeCountHandle() {
      return this.articleItem.likeCount ? this.articleItem.likeCount : "赞";
    },
    isLikeOperation() {
      return this.articleItem.isLike
        ? require("@/assets/img/common/love_active.png")
        : require("@/assets/img/common/love.png");
    },
  },
  mounted() {
    this.$bus.$on("sync-a", this.syncHandle);
  },
  destroyed() {
    this.$bus.$off("sync-a", this.syncHandle);
  },
  methods: {
 
  },
};
</script>
<style lang='less' scoped>
.detail-operation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 15px 0;
  border-bottom: 1px solid rgba(232, 235, 236, 0.5);
  background-color: #fff;
  div {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: 25px;
      height: 25px;
      margin-bottom: 5px;
    }
    .icon:nth-child(1) {
      width: 23px;
      height: 23px;
    }
    p {
      font-size: 13px;
    }
  }
  .icon:nth-child(1) {
    width: 22px;
    height: 22px;
  }
}
</style>