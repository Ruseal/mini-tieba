<template>
  <div class="article-item">
    <user-label
      v-if="userLabelType === 'tieba'"
      @on-right="onUserLabelRight"
      :user-label="{
        avatar: null,
        title: articleItem.tieba.tiebaName,
        focusCount: articleItem.tieba.focusCount,
        contentCount: articleItem.tieba.contentCount,
      }"
      label-right="exit"
      :label-type="['count']"
    />
    <user-label
      v-if="userLabelType === 'user'"
      @on-right="onUserLabelRight"
      :user-label="{
        avatar: articleItem.author.avatar,
        title: articleItem.author.nickname
          ? articleItem.author.nickname
          : articleItem.author.username,
        createTime: articleItem.createTime,
        authId: articleItem.author.id,
        tiebaMaxAuthId: tiebaMsg.maxAuth.id,
      }"
      label-right="exit"
      :label-type="['time']"
      isMaxAuth
    />
    <div @touchstart="touchStart" @touchmove="touchMove" @touchend="onArticle">
      <div class="font-text">
        <div class="text-title">{{ articleItem.title }}</div>
        <div class="text-content" ref="contentRef">
          {{ articleItem.test }}
        </div>
      </div>
      <!-- ------------一张图片---------- -->
      <div v-if="imageList && imageList.length === 1" class="img-wrapper-one">
        <img
          class="img-one"
          v-lazy="img"
          alt=""
          @load="imageLoad"
          v-for="(img, index) in imageList"
          :key="index"
        />
      </div>
      <!-- ---------------两张图片--------------- -->
      <div v-if="imageList && imageList.length === 2" class="img-wrapper-two">
        <img
          v-lazy="img"
          alt=""
          v-for="(img, index) in imageList"
          :key="index"
        />
      </div>
      <!-- ------------------三张图片------------------- -->
      <div v-if="imageList && imageList.length === 3" class="img-wrapper-three">
        <img
          v-lazy="img"
          alt=""
          v-for="(img, index) in imageList"
          :key="index"
        />
      </div>
      <!-- -------------------------大于三张--------------------- -->
      <div v-if="imageList && imageList.length > 3" class="img-wrapper-three">
        <img
          v-lazy="img"
          alt=""
          v-for="(img, index) in imageList.slice(0, 3)"
          :key="index"
        />
        <div class="img-mask" ref="maskRef">+{{ imageList.length - 3 }}</div>
      </div>
      <div class="article-bottom">
        <div @touchend.stop>
          <img src="@/assets/img/common/share.png" alt="" /> 分享
        </div>
        <div>
          <img src="@/assets/img/common/msg.png" alt="" />{{
            articleItem.commentCount
          }}
        </div>
        <div @touchstart.stop="articleLikeHandle('sync-a')">
          <img
            @touchend.stop
            :src="
              articleItem.isLike
                ? require('@/assets/img/common/love_active.png')
                : require('@/assets/img/common/love.png')
            "
            alt=""
          />{{ articleItem.likeCount }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixins from "@/mixins/mixin";
import UserLabel from "./UserLabel.vue";
export default {
  name: "articleItem",
  components: { UserLabel },
  mixins: [mixins],
  data() {
    return {
      ss: 1,
      imageList: [],
      start: {
        x: 0,
        y: 0,
      },
      move: {
        x: 0,
        y: 0,
      },
    };
  },
  mounted() {
    this.ss = 3;
    this.createDomHandle();
  },
  destroyed() {
    this.$bus.$off("sync-d", this.syncHandle);
    this.$bus.$off("sync-msg", this.syncMsg);
  },
  props: {
    articleItem: {
      type: Object,
      default() {
        return {};
      },
    },
    tiebaMsg: {
      type: Object,
      require: true,
    },
    userLabelType: {
      type: String,
      default() {
        return "tieba";
      },
    },
  },
  methods: {
    createDomHandle() {
      this.imageList = this.articleItem.imageList;
      this.$bus.$on("sync-d", this.syncHandle);
      this.$bus.$on("sync-msg", this.syncMsg);
    },
    syncMsg(event) {
      if (this.articleItem.id !== event.id) return;
      this.articleItem.commentCount += event.count;
    },
    //图片加载完后进行监听刷新滚动区
    imageLoad() {
      this.$emit("image-load");
    },
    onUserLabelRight() {
      this.$emit("remove-article", this.articleItem.id);
    },
    touchStart(e) {
      this.start.x = e.targetTouches[0].pageX;
      this.start.y = e.targetTouches[0].pageY;
    },
    touchMove(e) {
      this.move.x = e.targetTouches[0].pageX - this.start.x;
      this.move.y = e.targetTouches[0].pageY - this.start.y;
    },
    onArticle() {
      if (Math.abs(this.move.x) < 10 && Math.abs(this.move.y) < 10) {
        this.$router.push({
          name: "detail",
          params: {
            id: this.articleItem.id,
            tiebaName: this.articleItem.tieba.tiebaName,
          },
        });
      }
      this.move.x = 0;
      this.move.y = 0;
    },
  },
};
</script>
<style lang='less' scoped>
.article-item {
  width: 100vw;
  margin-bottom: 5px;
  padding: 10px 10px 0 10px;
  background-color: rgb(255, 255, 255);
  .font-text {
    padding: 4px 0;
    .text-title,
    .text-content {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      display: -moz-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
      font-size: 13px;
    }
  }
  .img-wrapper-one {
    max-width: 66%;
    max-height: 260px;
    overflow: hidden;
    .img-one {
      width: 100%;
      border-radius: 5px;
    }
  }
  .img-wrapper-two {
    display: flex;
    max-width: 66%;
    max-height: 110px;
    overflow: hidden;
    img {
      object-fit: cover;
      object-position: top;
      width: 49%;
      height: 110px;
      margin-right: 5px;
      border-radius: 5px;
    }
  }
  .img-wrapper-three {
    position: relative;
    display: flex;
    max-width: 100%;
    max-height: 110px;
    overflow: hidden;
    img {
      object-fit: cover;
      object-position: top;
      width: 32%;
      height: 110px;
      margin-right: 2%;
      border-radius: 5px;
    }
    img:nth-child(3) {
      margin-right: unset;
    }
    .img-mask {
      position: absolute;
      color: rgb(219, 209, 209);
      right: 0;
      width: 32%;
      height: 110px;
      text-align: center;
      font-size: 20px;
      line-height: 110px;
      border-radius: 5px;
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
  .article-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 10px 40px;
    div {
      display: flex;
      align-items: center;
      line-height: 15px;
      font-size: 13px;
      img {
        width: 15px;
        height: 15px;
        margin-right: 5px;
      }
    }
  }
}
</style>