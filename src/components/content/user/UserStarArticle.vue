<template>
  <div class="user-star-article" ref="userStarArticleRef">
    <div class="delete">
      <img @click="deleteStar" src="../../../assets/img/user/delete.png" alt="" />
    </div>
    <div class="right">
      <van-cell
        @click="toUserDetail"
        class="cell"
        :title="
          starItem.author.nickname
            ? starItem.author.nickname
            : starItem.author.username
        "
        center
      >
        <img
          class="avatar"
          slot="icon"
          :src="
            starItem.author.avatar
              ? starItem.author.avatar
              : require('../../../assets/img/common/user-avatar/b.jpg')
          "
        />
        <van-button
          class="right-button"
          v-if="!starItem.author.isSelfArticle"
          :class="{ focused: starItem.author.isfocus }"
          plain
          type="info"
          :color="
            starItem.author.isfocus ? 'rgb(214, 214, 214)' : 'rgb(111, 86, 252)'
          "
          >{{ starItem.author.isfocus ? "已关注" : "关注" }}</van-button
        >
      </van-cell>
      <div class="container" @click="toDetail">
        <img v-if="starItem.imageList" :src="starItem.imageList[0]" alt="" />
        <div>
          {{ starItem.title ? starItem.title : starItem.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "user-star-article",
  components: {},
  data() {
    return {};
  },
  props: {
    starItem: {
      type: Object,
      required: true,
    },
  },
  methods: {
    editModel(isEdit) {
      if (!isEdit) {
        this.$refs.userStarArticleRef.style.cssText = "margin-left: 0px;";
        return;
      }
      this.$refs.userStarArticleRef.style.cssText = "margin-left: -45px;";
    },
    toUserDetail() {
      this.$router.push({
        name: "user-detail",
        params: {
          selfUser: true,
          userId: this.starItem.author.id,
        },
      });
    },
    toDetail() {
      this.$router.push({
        name: "detail",
        params: {
          id: this.starItem.id,
          tiebaName: this.starItem.tieba.tiebaName,
          from: this.$route.name,
        },
      });
    },
    deleteStar(){
      this.$emit('deleteStar',this.starItem.id)
    }
  },
};
</script>
<style lang='less' scoped>
.user-star-article {
  display: flex;
  width: calc(100vw + 45p);
  border-bottom: 6px solid rgb(238, 243, 247);
  margin-left: -45px;
  .delete {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 45px;
    img {
      width: 20px;
      height: 20px;
    }
  }
  .right {
    width: 100vw;
    .avatar {
      width: 35px;
      height: 35px;
      border-radius: 18px;
      object-fit: cover;
      object-position: center;
      margin-right: 10px;
    }
    .right-button {
      width: 75px;
      height: 28px;
      font-size: 11px;
      /deep/ .van-button__text {
        font-size: 13px;
        color: rgb(111, 86, 252);
      }
    }
    .focused {
      /deep/ .van-button__text {
        color: rgb(151, 151, 151);
      }
    }
    .container {
      display: flex;
      padding: 5px 15px 10px;
      align-items: center;
      img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        object-position: center;
        margin-right: 10px;
      }
      div {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        display: -moz-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        font-size: 15px;
      }
    }
  }
}
</style>