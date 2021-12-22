<template>
  <div class="home">
    <scroll
      class="scroll-out"
      :probeType="3"
      @scrollPosition="scrollOutPosition"
      @click.prevent
      click
      ref="scrollOutRef"
    >
      <div class="scroll-out-wrapper">
        <home-nav @send-article="sendArticle" ref="homeNavRef" />
        <div v-show="isShowPullDownFreshPrompt" class="pull-refresh-success">
          {{
            isArticleHasValue
              ? "wow,又有" + newArticleListLength + "条精彩内容"
              : "没有更多内容了"
          }}
        </div>
        <tabs @click="tabClick" :tab-list="tabList" ref="tabRef" />

        <div class="page">
          <loading class="loading" v-show="dataStatus === 'loading'" />
          <error
            class="error"
            v-show="dataStatus === 'error'"
            @fresh-page="freshPage"
          />
        </div>
        <div class="scroll-in-containr" ref="containerRef">
          <scroll
            v-for="(item1, index) in homeData"
            :key="index"
            class="scroll-in"
            @end="pullDown"
            @pullingUp="pullingUp"
            pullUpLoad
            :probeType="3"
            bounce
            ref="scrollInRef"
          >
            <div ref="wrapRef">
              <div class="img-wrap" ref="imgWrapRef">
                <img
                  :src="
                    isDownLoading
                      ? require('@/assets/img/home/pulldown_loading.gif')
                      : require('@/assets/img/home/pulldown_static.png')
                  "
                  alt=""
                />
              </div>
              <div class="articleWrap" ref="articleWrapRef">
                <article-item
                  v-for="item2 in item1"
                  :key="item2.id"
                  :article-item="item2"
                  @image-load="imageLoad"
                  @remove-article="onRemoveArticle"
                />
              </div>
              <div class="pullup-style">
                <img
                  v-show="isArticleHasValue"
                  src="@/assets/img/home/pulldown_loading.gif"
                  alt=""
                />
                <div @click.stop="pullingUp" v-show="!isArticleHasValue">
                  没有更多了,点击重新加载
                </div>
              </div>
            </div>
          </scroll>
        </div>
      </div>
    </scroll>
    <add-article-popup v-if="dataStatus === 'ok'" ref="addArticleRef" />
  </div>
</template>

<script>
import { getArticleList } from "@/api/home-net";
import { getUserMessage } from "@/api/user-net";
import { isLoginMethod } from "@/methods/common-methods";
import debounce from "@/utils/debounce";
import ArticleItem from "@/components/common/ArticleItem.vue";
import Error from "@/components/common/Error.vue";
import Loading from "@/components/common/Loading.vue";
import Scroll from "@/components/common/Scroll.vue";
import Tabs from "@/components/common/Tabs.vue";
import HomeNav from "@/components/content/home/HomeNav.vue";
import AddArticlePopup from "@/components/common/AddArticlePopup.vue";

export default {
  name: "home",
  components: {
    Scroll,
    HomeNav,
    Tabs,
    Error,
    Loading,
    ArticleItem,
    AddArticlePopup,
  },
  data() {
    return {
      dataStatus: "loading", //页面的展示状态
      userId: 0,
      active: 1,
      tabs: ["focusList", "electList", "hotList", "choiceList", "columnList"],
      tabList: ["关注", "推举", "热榜", "精选", "专栏"], //切换栏标题名字
      size: 5, //每次请求数据数量
      intervalTime: 500, //延迟时间
      freshScroll: [], //防抖函数
      freshType: "pull-up", //数据刷新方式，默认上拉
      timerLoading: null, //清除正在加载页面状态的定时器
      isDownLoading: false, //是否正在下拉加载中
      isPullDown: true, // 是否开启下拉刷新
      imgWrapHeight: 0, //下拉加载 logo Dom高度
      isShowPullDownFreshPrompt: false, //是否展示下拉刷新后的提示
      newArticleListLength: 0, //下拉请求过来的新数据长度
      isArticleHasValue: true, //下拉请求的数据列表是否有值
      isUpLoading: false, //是否正在上拉加载中
      homeData: {
        focusList: [],
        electList: [],
        hotList: [],
        choiceList: [],
        columnList: [],
      }, //首页数据
    };
  },
  created() {},
  mounted() {
    this.getArticleListMethod();
    console.log(this.$children);
  },
  methods: {
    async getUserMessageMethod() {
      try {
        const { status, data } = await getUserMessage();
        if (status === 401) return;
        if (status !== 200) throw new Error();
        this.dataStatus = "ok";
        this.userId = data.id;
      } catch (err) {
        this.dataStatus = "error";
      }
    },
    //初始化页面
    initDom() {
      this.$nextTick(() => {
        for (let index = 0; index < this.tabList.length; index++) {
          this.freshScroll.push(
            debounce(this.$refs.scrollInRef[index].refresh, 100)
          );
        }
        this.imgWrapHeight = this.$refs.imgWrapRef[1].offsetHeight;
      });
    },
    //监听tab栏切换
    tabClick(index) {
      if (this.active === index) return; //是否为当前tab
      if (this.isDownLoading || this.isUpLoading) {
        this.$toast("数据加载中，请稍后尝试");
        return;
      } // 是否正在加载数据中，防止数据混乱
      clearTimeout(this.timerLoading); //清除加载页面状态定时器
      this.$refs.tabRef.active = index; //修改tab栏指向
      this.active = index; //修改为当前tab
      if (this.freshType === "pull-down") {
        this.isShowPullDownFreshPrompt = false; //隐藏下拉刷新后的提示
        this.isPullDown = true; //启用下拉刷新
      }
      if (this.active === 0) {
        this.getUserMessageMethod();
      }
      if (this.homeData[this.tabs[index]].length) {
        this.dataStatus = "ok";
        return;
      }
      this.dataStatus = "loading";
      this.timerLoading = setTimeout(() => {
        this.freshType = "pull-up";
        this.getArticleListMethod();
      }, this.intervalTime);
    },
    //通过外层滚动区控制内层滚动区
    scrollOutPosition(position) {
      if (this.dataStatus !== "ok") return;
      if (
        Math.abs(position.y) >= this.$refs.homeNavRef.$el.offsetHeight - 1 ||
        Math.abs(position.y) <= 0
      ) {
        // 监听外部滚动区的触顶和触底开启内部滚动滚或中间区域禁用
        //设置为开启
        this.$refs.scrollInRef[this.active].bs.enable();
      } else {
        //设置为禁用
        this.$refs.scrollInRef[this.active].bs.disable();
      }
    },
    // 下拉后Dom的样式改变
    setPullDown(flag) {
      if (flag) {
        this.isPullDown = false; //禁用下拉刷新
        this.$refs.imgWrapRef[
          this.active
        ].style.cssText = `position: relative;top: 0;`; //设置正在下拉加载中dom
      } else {
        this.$refs.imgWrapRef[
          this.active
        ].style.cssText = `position: absolute;top: -70px;`; //设置非正在下拉加载dom
      }
      this.$nextTick(() => {
        this.$refs.scrollInRef[this.active].refresh();
      }); //刷新内部滚动区
    },
    //下拉结束后的操作
    pullDownEnd() {
      this.isDownLoading = false; //改变状态当前为非下拉加载状态
      this.isShowPullDownFreshPrompt = true; //展示下拉刷新后的提示
      setTimeout(() => {
        this.isShowPullDownFreshPrompt = false; //隐藏下拉刷新后的提示
        this.isPullDown = true; //启用下拉刷新
      }, this.intervalTime * 3); //下拉加载后提示信息存在延迟时间
    },
    // 下拉操作
    pullDown() {
      if (!this.isPullDown) return;
      let articleWrapTop =
        this.$refs.articleWrapRef[this.active].getBoundingClientRect().top;
      let scrollInTop =
        this.$refs.scrollInRef[this.active].$el.getBoundingClientRect().top;
      let spacing = articleWrapTop - scrollInTop;
      if (spacing > this.imgWrapHeight) {
        this.isDownLoading = true; //改变状态当前为下拉加载状态
        this.isArticleHasValue = true;
        setTimeout(() => {
          this.freshType = "pull-down";
          this.getArticleListMethod();
        }, this.intervalTime);
      }
    },
    //上拉重新刷新滚动区
    pullUpFresh() {
      this.isUpLoading = false;
      this.$nextTick(() => {
        //页面渲染后刷新内部滚动
        this.$refs.scrollInRef[this.active].refresh();
        //设置可进行下一次上拉
        this.$refs.scrollInRef[this.active].finishPullUp();
        //修改为非上拉刷新状态
      });
    },
    // 上拉操作
    pullingUp() {
      if (this.isUpLoading) return;
      this.isUpLoading = true;
      this.isArticleHasValue = true;
      setTimeout(() => {
        this.freshType = "pull-up";
        this.getArticleListMethod();
      }, this.intervalTime);
    },
    async getArticleListMethod() {
      try {
        if (this.freshType === "pull-up") {
          this.isUpLoading = true;
        }
        const { data, status } = await getArticleList({
          size: this.size,
          strId: JSON.stringify(
            this.homeData[this.tabs[this.active]]
              .map((item) => item.id)
              .toString()
          ),
          active: this.active,
          userId: this.userId,
        });
        //数据为空或状态码错误抛出异常
        if (status !== 200) throw new Error();
        //设置页面展示状态
        this.dataStatus = "ok";
        //执行初始化页面
        this.initDom();
        // //判断数据是否请求完到最后
        if (!data.length) {
          //设置文章列表没有数据
          this.isArticleHasValue = false;
          //当为上拉时，调用下拉结束函数
          this.freshType === "pull-up" && this.pullUpFresh();
          //当为下拉时，调用下拉结束函数
          this.freshType === "pull-down" && this.pullDownEnd();
          return;
        }
        //判断是上拉刷新还是下拉刷新
        if (this.freshType === "pull-up") {
          //上拉刷新添加数据到数组末尾
          this.homeData[this.tabs[this.active]].push(...data);
          this.pullUpFresh();
        } else if (this.freshType === "pull-down") {
          //获取的新数据个数
          this.newArticleListLength = data.length;
          // //下拉刷新添加数据到数组最前
          this.homeData[this.tabs[this.active]].unshift(...data);
          this.pullDownEnd();
        } else {
          console.error("fresh is error");
        }
      } catch (err) {
        this.dataStatus = "error";
        this.isUpLoading = false;
        this.isDownLoading = false;
        this.isArticleHasValue = false;
        this.$refs.scrollInRef[this.active].finishPullUp();
      }
    },
    //图片加载完成后刷新内层滚动区
    imageLoad() {
      this.freshScroll[this.active]();
    },
    //点击发表按钮事件
    async sendArticle() {
      if (!(await isLoginMethod(this))) return;
      this.$refs.addArticleRef.isShowAddArticlePopup = true;
    },
    // 错误页面的重新加载刷新页面
    freshPage() {
      this.dataStatus = "loading";
      setTimeout(() => {
        this.freshType = "pull-up";
        this.getArticleListMethod();
      }, this.intervalTime);
    },
    // 移除不感兴趣贴子的提示
    onRemoveArticle(articleId) {
      this.$dialog
        .confirm({
          message: "对该条贴子不感兴趣?",
        })
        .then(() => {
          this.removeArticle(articleId);
        })
        .catch(() => {});
    },
    // 移除不感兴趣贴子的操作
    removeArticle(articleId) {
      if (this.isLoading) {
        this.$toast("数据加载中，请稍后尝试");
        return;
      }
      let _thisList = this.homeData[this.tabs[this.active]];
      _thisList.splice(
        _thisList.indexOf(
          _thisList.find((item) => {
            return item.id === articleId;
          })
        ),
        1
      );
      // 页面重新渲染后再进行实现滚动区
      this.$nextTick(() => {
        this.$refs.scrollInRef[this.active].refresh();
      });
    },
  },
  watch: {
    //监听tab切换
    active(newActive) {
      this.$refs.containerRef.style.cssText = `transform: translateX(-${
        newActive * 20
      }%);`;
    },
    // 监听下拉加载时的数据变化
    isDownLoading(flag) {
      this.setPullDown(flag);
    },
  },
};
</script>
<style lang='less' scoped>
.home {
  width: 100vw;
  height: calc(100vh - 50px);
  .scroll-out {
    height: 100%;
    .scroll-out-wrapper {
      height: calc(100% + 46px);
      .pull-refresh-success {
        position: absolute;
        z-index: 996;
        top: 89px;
        width: 100%;
        height: 30px;
        font-size: 12px;
        background-color: rgba(88, 104, 252, 0.7);
        color: white;
        text-align: center;
        line-height: 30px;
      }
      .page {
        width: 100vw;
        position: relative;
        .loading,
        .error {
          position: absolute;
          width: 100vw;
          height: calc(100vh - 44px - 50px);
          z-index: 6;
        }
      }
      .scroll-in-containr {
        width: 500vw;
        transform: translateX(-20%);
        transition: 0.4s;
        display: flex;
        .scroll-in {
          width: 100vw;
          height: calc(100vh - 44px - 50px);
          position: relative;
          background-color: #f1f2f7;
          .img-wrap {
            position: absolute;
            top: -70px;
            z-index: 5;
            width: 100vw;
            height: 70px;
            img {
              width: 80px;
              height: 40px;
              margin-left: 50%;
              margin-top: 15px;
              transform: translateX(-50%);
            }
          }
          .articleWrap {
            position: relative;
            z-index: 5;
          }
          .pullup-style {
            img {
              width: 60px;
              height: 30px;
              margin-left: 50%;
              transform: translateX(-50%);
            }
            div {
              font-size: 13px;
              line-height: 30px;
              text-align: center;
              color: rgb(146, 146, 146);
            }
          }
        }
      }
    }
  }
}
</style>