<template>
  <div class="tieba">
    <loading v-if="statusData === 'loading'" />
    <error v-if="statusData === 'error'" />
    <scroll
      v-else
      class="scroll-out"
      :probeType="3"
      @scrollPosition="scrollOutPosition"
      click
    >
      <div class="scroll-out-wrapper">
        <div class="top" ref="topRef">
          <tieba-nav />
          <tieba-card @onavatar="onAvatar" :tieba-msg="tiebaDeatil" />
          <placed-top :tieba-msg="tiebaDeatil" />
        </div>
        <tieba-tabs />
        <scroll
          class="scroll-in"
          :probeType="3"
          pullUpLoad
          @pullingUp="freshArticleList"
          ref="scrollInRef"
          click
        >
          <article-item
            v-for="item in articleList"
            :key="item.id"
            :article-item="item"
            :tieba-msg="tiebaDeatil"
            @image-load="fresh"
            user-label-type="user"
            label-right-child=""
          />
          <div class="pullup-style">
            {{ isArticleHasValue ? "正在加载..." : "没有更多了" }}
          </div>
        </scroll>
      </div>
    </scroll>
    <div v-if="statusData === 'ok'" @click="onAddArticle" class="add-article">
      +
    </div>
    <add-article-popup
      @unshift-article="unshiftArticle"
      :tieba-msg="tiebaDeatil"
      ref="addArticleRef"
    />
  </div>
</template>

<script>
import {
  getTiebaDeatil,
  getArticleList,
  getSingleArticle,
  getTiebaAvatar,
} from "@/api/tieba-net";
import { userRecordTieba } from "@/api/user-net";
import { isLoginMethod } from "@/methods/common-methods";
import debounce from "@/utils/debounce";
import ArticleItem from "@/components/common/ArticleItem.vue";
import Error from "@/components/common/Error.vue";
import Loading from "@/components/common/Loading.vue";
import Scroll from "@/components/common/Scroll.vue";
import PlacedTop from "@/components/content/tieba/PlacedTop.vue";
import TiebaCard from "@/components/content/tieba/TiebaCard.vue";
import TiebaNav from "@/components/content/tieba/TiebaNav.vue";
import TiebaTabs from "@/components/content/tieba/TiebaTabs.vue";
import AddArticlePopup from "@/components/common/AddArticlePopup.vue";
export default {
  name: "tieba",
  components: {
    Scroll,
    TiebaNav,
    TiebaCard,
    PlacedTop,
    TiebaTabs,
    Loading,
    Error,
    ArticleItem,
    AddArticlePopup,
  },
  data() {
    return {
      statusData: "loading",
      tiebaDeatil: {},
      articleList: [],
      offset: 0,
      freshScroll: null,
      isArticleHasValue: true,
    };
  },
  async created() {
    await this.getTiebaDeatilMethod();
    this.getArticleListMethod();
  },
  mounted() {
    this.initDom();
  },
  methods: {
    async getTiebaDeatilMethod() {
      try {
        const { status, data } = await getTiebaDeatil(this.$route.query.tid);
        if (status !== 200) throw new Error();
        this.statusData = "ok";
        this.tiebaDeatil = data;
        this.userRecordTiebaMethod();
      } catch (error) {
        this.statusData = "error";
      }
    },
    async getArticleListMethod() {
      try {
        const { data, status } = await getArticleList(
          this.tiebaDeatil.id,
          this.offset,
          10
        );
        if (status !== 200) throw new Error();

        if (!data.length) {
          this.isArticleHasValue = false;
          this.$refs.scrollInRef.finishPullUp();
          return;
        }
        this.articleList.push(...data);
        this.offset += 10;
        this.$nextTick(() => {
          this.$refs.scrollInRef.refresh();
          this.$refs.scrollInRef.finishPullUp();
        });
      } catch (error) {
        this.statusData = "error";
      }
    },
    async unshiftArticle(articleId) {
      try {
        const { data, status } = await getSingleArticle(articleId);
        if (status !== 200) throw new Error();
        this.offset += 1;
        this.articleList.unshift(data);
        this.$nextTick(() => {
          this.$refs.scrollInRef.refresh();
        });
      } catch (error) {
        this.$toast.fail("网络错误");
      }
    },
    async onAddArticle() {
      if (!(await isLoginMethod(this))) return;
      this.$refs.addArticleRef.isShowAddArticlePopup = true;
    },
    async userRecordTiebaMethod() {
      if (!this.tiebaDeatil.yourUserId) return;
      try {
        const { status } = await userRecordTieba(this.tiebaDeatil.id);
        if (status !== 200) throw new Error();
      } catch (error) {
        this.$toast.fail("网络不稳定");
      }
    },
    initDom() {
      this.$refs.scrollInRef.bs.disable();
      this.freshScroll = debounce(this.$refs.scrollInRef.refresh, 100);
    },
    scrollOutPosition(e) {
      if (
        Math.abs(e.y) >= this.$refs.topRef.offsetHeight ||
        Math.abs(e.y) === 0
      ) {
        this.$refs.scrollInRef.bs.enable();
      } else {
        this.$refs.scrollInRef.bs.disable();
      }
    },
    fresh() {
      this.freshScroll();
    },
    freshArticleList() {
      this.isArticleHasValue = true;
      setTimeout(() => {
        this.getArticleListMethod();
      }, 1000); //上拉加载动画过程延迟时间
    },
    onAvatar() {
      this.$router.push({
        name: "tieba-msg",
        query: {
          msg: this.tiebaDeatil,
        },
      });
    },
  },
};
</script>
<style lang='less' scoped>
.tieba {
  .scroll-out {
    position: relative;
    width: 100vw;
    height: 100vh;
    .scroll-out-wrapper {
      width: 100vw;
      height: calc(100vh + 225px);
      .top {
        width: 100vw;
        height: 225px;
        background-color: rgba(0, 0, 0, 0.8);
      }

      .scroll-in {
        width: 100vw;
        height: calc(100vh - 35px);
        background-color: rgb(239, 243, 245);
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
  }
  .add-article {
    position: fixed;
    bottom: 40px;
    right: 15px;
    width: 45px;
    height: 45px;
    font-size: 30px;
    color: white;
    border-radius: 23px;
    text-align: center;
    line-height: 45px;
    background-color: rgb(78, 78, 78);
  }
}
</style>