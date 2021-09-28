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
          <tieba-card :tieba-msg="tiebaDeatil" />
          <placed-top :tieba-msg="tiebaDeatil"/>
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
          />
          <div class="pullup-style">
            {{ isArticleHasValue ? "正在加载..." : "没有更多了" }}
          </div>
        </scroll>
      </div>
    </scroll>
  </div>
</template>

<script>
import { getTiebaDeatil, getArticleList } from "../../api/tieba-net";
import debounce from "../../utils/debounce";
import ArticleItem from "../../components/common/ArticleItem.vue";
import Error from "../../components/common/Error.vue";
import Loading from "../../components/common/Loading.vue";
import Scroll from "../../components/common/Scroll.vue";
import PlacedTop from "../../components/content/tieba/PlacedTop.vue";
import TiebaCard from "../../components/content/tieba/TiebaCard.vue";
import TiebaNav from "../../components/content/tieba/TiebaNav.vue";
import TiebaTabs from "../../components/content/tieba/TiebaTabs.vue";
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
        console.log(data);
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
        console.log(data);
        this.offset += 10;
        this.$nextTick(() => {
          this.$refs.scrollInRef.refresh();
          this.$refs.scrollInRef.finishPullUp();
        });
      } catch (error) {
        this.statusData = "error";
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
  },
};
</script>
<style lang='less' scoped>
.tieba {
  .scroll-out {
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
}
</style>