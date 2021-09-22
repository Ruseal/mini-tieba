<template>
  <div class="deatil">
    <detail-nav
      ref="navRef"
      :nav-data="{ avatar: null, title: $route.params.tiebaName }"
      ><left-arrow slot="left" @click.native="onNavLeft"
    /></detail-nav>
    <div v-if="dataStatus === 'loadding'">loading...</div>
    <div v-else-if="dataStatus === 'error'">error</div>
    <div v-else>
      <detail-tabs
        class="tabs-virtual"
        @on-tab="correctIndex"
        v-show="isShowTabsVirtual"
        ref="tabsVirtualRef"
      />
      <scroll
        class="scroll-out"
        :probeType="3"
        :bounce="false"
        @scrollPosition="scrollOutPosition"
        @pullingUp="freshData"
        pullUpLoad
        click
        ref="scrollOutRef"
      >
        <detail-content @image-load="imageLoad" :content-data="detailData">
          <user-label
            slot="user-label"
            :user-label="
              detailData.author && {
                avatar: detailData.author.avatar,
                title: detailData.author.nickname
                  ? detailData.author.nickname
                  : detailData.author.username,
                members: detailData.author.members,
                createTime: detailData.createTime,
                level: 3,
              }
            "
            isLevelCard
            avatar-type="round"
            :label-type="['time']"
            label-right="focus"
            isMenber
          />
        </detail-content>
        <detail-operation :operation-data="detailData" />
        <div class="user-label-tieba">
          <user-label
            :user-label="
              detailData.tieba && {
                avatar: null,
                title: detailData.tieba.tiebaName,
                focusCount: detailData.tieba.focusCount,
                contentCount: detailData.tieba.contentCount,
              }
            "
            :label-type="['count']"
            label-right="arrow"
          />
        </div>
        <detail-tabs class="detail-tabs" @on-tab="correctIndex" ref="tabsRef" />
        <div v-show="!commentData.length" class="not-data">
          {{ commentData.length }}
        </div>
        <div v-show="commentData.length">
          <detail-comment
            v-for="(item ,index) in commentData"
            :key="item.id"
            :comment-item="item"
            :floor="index"
            @image-load="imageLoad"
            child-label-type="floor"
            isHasImg
            isHasShare
            isHasReplyText
          >
          </detail-comment>
          <div class="not-more">{{ loadMore }}</div>
        </div>
      </scroll>
      <detail-bottom @to-top="toTop" :detail-data="detailData" />
      <reply-popup />
      <textarea-popup :detail-id="detailData.id" />
      <textarea-img-popup :detail-id="detailData.id" />
      <remove-comment-popup @delete-fresh-comment="deleteFreshComment" />
    </div>
  </div>
</template>

<script>
import { getDetail, getComment } from "@/api/detail-net";
import * as StoreConstant from "../../constant/store-constant";
import debounce from "../../utils/debounce";
import DetailNav from "@/components/content/detail/DetailNav.vue";
import LeftArrow from "@/components/common/LeftArrow.vue";
import Scroll from "@/components/common/Scroll.vue";
import UserLabel from "@/components/common/UserLabel.vue";
import DetailContent from "@/components/content/detail/DetailContent.vue";
import DetailOperation from "@/components/content/detail/DetailOperation.vue";
import DetailTabs from "@/components/content/detail/DetailTabs.vue";
import DetailComment from "@/components/content/detail/DetailComment.vue";
import DetailBottom from "@/components/content/detail/DetailBottom.vue";
import ReplyPopup from "@/components/content/detail/ReplyPopup.vue";
import TextareaPopup from "@/components/content/detail/TextareaPopup.vue";
import TextareaImgPopup from "@/components/content/detail/TextareaImgPopup.vue";
import RemoveCommentPopup from "../../components/content/detail/RemoveCommentPopup.vue";
export default {
  name: "detail",
  components: {
    DetailNav,
    LeftArrow,
    Scroll,
    UserLabel,
    DetailContent,
    DetailOperation,
    DetailTabs,
    DetailComment,
    DetailBottom,
    ReplyPopup,
    TextareaPopup,
    TextareaImgPopup,
    RemoveCommentPopup,
  },

  data() {
    return {
      isShowTabsVirtual: false,
      dataStatus: "loadding",
      offset: 0,
      detailData: {},
      commentData: [],
      copyCommentData: [],
      freshScroll: null,
      commentLoadStatus: true,
      currentIndex: 0,
    };
  },
  computed: {
    loadMore() {
      return this.commentLoadStatus ? "上拉加载更多评论" : "暂无更多评论";
    },
  },
  mounted() {
    this.getDetailDataHandle();
    this.$bus.$on("fresh-comment", this.freshData);
  },
  destroyed() {
    this.$bus.$off("fresh-comment", this.freshData);
  },
  methods: {
    domHandle() {
      this.$store.commit(
        StoreConstant.SAVE_CURRENT_DETAILID,
        this.detailData.author.id
      );
      this.freshScroll = debounce(this.$refs.scrollOutRef.refresh, 200);
    },
    async getDetailDataHandle() {
      try {
        const { data, status } = await getDetail(this.$route.params.id);
        const isErr = await this.getCommentHandle();
        if (status !== 200 || isErr) throw new Error();
        this.dataStatus = "ok";
        this.detailData = data;
        this.domHandle();
      } catch (err) {
        this.dataStatus = "error";
      }
    },
    async getCommentHandle() {
      try {
        const { data, status } = await getComment(
          this.$route.params.id,
          this.offset,
          10
        );
        if (status !== 200) throw new Error();
        this.dataStatus = "ok";
        if (!data.length) {
          this.commentLoadStatus = false;
          this.$nextTick(() => {
            if (this.$refs.scrollOutRef) {
              this.$refs.scrollOutRef.finishPullUp();
            }
          });
          return;
        }
        this.commentData.push(...data);
        this.copyCommentData = this.commentData;
        this.offset += data.length;
        this.$nextTick(() => {
          if (this.$refs.scrollOutRef) {
            this.$refs.scrollOutRef.refresh();
            this.$refs.scrollOutRef.finishPullUp();
          }
        });
      } catch (err) {
        console.log(err);
        this.dataStatus = "error";
        return "err";
      }
    },
    freshData() {
      this.commentLoadStatus = true;
      setTimeout(() => {
        this.getCommentHandle();
      }, 1000);
    },
    onClickLeft() {
      this.$router.back();
    },
    imageLoad() {
      this.freshScroll();
    },
    scrollOutPosition() {
      if (
        this.$refs.tabsRef.$el.getBoundingClientRect().top -
          this.$refs.navRef.$el.offsetHeight <=
        0
      ) {
        this.isShowTabsVirtual = true;
      } else {
        this.isShowTabsVirtual = false;
      }
    },
    correctIndex(index) {
      this.currentIndex = index;
      if (index === 1) {
        this.commentData = this.commentData.filter(
          (item) => item.author.id === this.detailData.author.id
        );
        this.$nextTick(() => {
          this.$refs.scrollOutRef.refresh();
        });
      } else {
        this.commentData = this.copyCommentData;
      }
      this.$refs.tabsRef.tabCurrentIndex = index;
      this.$refs.tabsVirtualRef.tabCurrentIndex = index;
    },
    onNavLeft() {
      this.$router.back();
    },
    toTop() {
      this.$refs.scrollOutRef.scrollTo(0, 0);
    },
    deleteFreshComment(event) {
      this.commentData.splice(
        this.commentData.indexOf(
          this.commentData.find((item) => {
            return item.id === event;
          })
        ),
        1
      );
      this.$bus.$emit("reply-popup", { isShowPopup: false });
    },
  },
};
</script>
<style lang='less' scoped>
.deatil {
  .tabs-virtual {
    position: fixed;
    top: 45px;
    z-index: 1;
  }
  .scroll-out {
    width: 100%;
    height: calc(100vh - 46px - 40px);
    background-color: #f1f2f7;
    .user-label-tieba {
      padding: 20px 10px;
      background-color: #fff;
    }
    .detail-tabs {
      margin-top: 8px;
    }
    .not-data {
      width: 100%;
      height: 300px;
      background-color: rgb(173, 147, 147);
    }
    .not-more {
      font-size: 12px;
      text-align: center;
      line-height: 30px;
      background-color: #fff;
    }
  }
}
</style>