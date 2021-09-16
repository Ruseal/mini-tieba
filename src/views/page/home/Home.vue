<template>
  <div class="home">
    <scroll
      class="scroll-out"
      :probeType="3"
      @scrollPosition="scrollPosition"
      ref="scrollOutRef"
    >
      <div class="scroll-out-wrapper">
        <home-nav ref="homeNavRef" />
        <div v-show="isShowPullDownFreshPrompt" class="pull-refresh-success">
          {{
            isArticleHasValue ? "wow,又有" + 22 + "条精彩内" : "没有更多内容了"
          }}
        </div>
        <van-tabs
          class="tabs"
          v-model="active"
          animated
          swipeable
          line-width="0.5rem"
          ref="tabsRef"
        >
          <van-tab v-for="(item, index) in tabsList" :title="item" :key="index">
            <scroll
              class="scroll-in"
              :probeType="3"
              pullUpLoad
              @pullingUp="pullUpFresh"
              @scrollPosition="scrollInPosition"
              ref="scrollInRef"
            >
              <div v-if="dataStatus === 'loadding'">loading...</div>
              <div v-else-if="dataStatus === 'error'">error</div>
              <van-pull-refresh
                v-else
                class="pull-down-refresh"
                v-model="isLoading"
                :head-height="100"
                :disabled="isPullDownDisabled"
                @refresh="pullDownFresh"
              >
                <img
                  class="huaji"
                  slot="pulling"
                  slot-scope="props"
                  src="@/assets/img/home/pulldownhuaji.png"
                  :style="{ transform: `scale(${props.distance / 80})` }"
                />

                <img
                  class="huaji"
                  slot="loosing"
                  src="@/assets/img/home/pulldownhuaji.png"
                />

                <img
                  class="huaji"
                  slot="loading"
                  src="@/assets/img/home/pulldownhuaji.png"
                />
                <div
                  v-for="(item, index) in articleList"
                  :key="index"
                  class="div-test"
                >
                  {{ 11 }}
                </div>
                <div class="pullup-style">
                  {{ isArticleHasValue ? "正在加载..." : "没有更多了" }}
                </div>
              </van-pull-refresh>
            </scroll>
          </van-tab>
          <div class="tabs-placeholder" slot="nav-right"></div>
        </van-tabs>
      </div>
    </scroll>
  </div>
</template>

<script>
import { getArticleList } from "@/api/home-net";

import Scroll from "@/components/common/Scroll.vue";
import HomeNav from "@/components/content/home/HomeNav.vue";
export default {
  name: "home",
  components: {
    Scroll,
    HomeNav,
  },
  data() {
    return {
      tabsList: ["关注", "推举", "热榜", "直播", "视频"], //切换栏标题名字
      active: 1, //选中标题栏引索
      isLoading: false, //是否正在下拉加载中
      isShowPullDownFreshPrompt: false, //是否展示下拉刷新后的提示
      dataStatus: "loadding", //页面的展示状态
      articleList: [], //文章列表的数据
      isPullDownDisabled: false, // 是否禁用下拉刷新
      isArticleHasValue: true, //请求的数据列表是否为空
      offset: 0, //请求数据参数偏移值
      freshType: "pull-up", //数据刷新方式
    };
  },
  mounted() {
    this.createDomHandle();
    //页面渲染之后请求数据
    this.getArticleListMethod();
  },
  methods: {
    createDomHandle() {
      //页面渲染后另内嵌套滚动禁用
      this.$nextTick(() => {
        this.$refs.scrollInRef[0].bs.disable();
      });
    },
    async getArticleListMethod() {
      const res = await getArticleList(this.offset, 5);
      try {
        console.log(res);
        //数据为空或状态码错误抛出异常
        if (res.status !== 200) throw new Error();
        //设置页面展示状态
        this.dataStatus = "ok";
        //判断数据是否请求完到最后
        if (!res.data.length) {
          //设置文章列表没有数据
          this.isArticleHasValue = false;
          //下拉刷新提示显隐延迟
          if (this.freshType === "pull-down") {
            //下拉刷新加载结束
            this.isLoading = false;
            //禁用下拉刷新
            this.isPullDownDisabled = true;
            this.isShowPullDownFreshPrompt = true;
            setTimeout(() => {
              this.isShowPullDownFreshPrompt = false;
              //开启下拉刷新
              this.isPullDownDisabled = false;
            }, 2000); //下拉加载后提示信息存在延迟时间
          }
          return;
        }
        //判断是上拉刷新还是下拉刷新
        if (this.freshType === "pull-up") {
          //上拉刷新添加数据到数组末尾
          this.articleList.push(...res.data);
        } else if (this.freshType === "pull-down") {
          //下拉刷新加载结束
          this.isLoading = false;
          //禁用下拉刷新
          this.isPullDownDisabled = true;
          //下拉刷新添加数据到数组最前
          this.articleList.unshift(...res.data);
          //下拉刷新提示显隐延迟
          this.isShowPullDownFreshPrompt = true;
          setTimeout(() => {
            this.isShowPullDownFreshPrompt = false;
            //开启下拉刷新
            this.isPullDownDisabled = false;
          }, 2000); //下拉加载后提示信息存在延迟时间
        } else {
          console.error("fresh is error");
        }
        //改变偏移值
        this.offset += 5;
        this.$nextTick(() => {
          //页面渲染后刷新内部滚动
          this.$refs.scrollInRef[0].refresh();
          //设置可进行下一次上拉
          this.$refs.scrollInRef[0].finishPullUp();
        });
      } catch (e) {
        this.dataStatus = "error";
      }
    },
    scrollPosition(position) {
      //监听外部滚动区的触顶和触底开启内部滚动滚或中间区域禁用
      if (
        Math.abs(position.y) >= this.$refs.homeNavRef.$el.offsetHeight ||
        Math.abs(position.y) <= 0
      ) {
        //设置为开启
        this.$refs.scrollInRef[0].bs.enable();
      } else {
        //设置为禁用
        this.$refs.scrollInRef[0].bs.disable();
      }
    },
    scrollInPosition(position) {
      //监听内部滚动是否为最顶才开启下拉刷新
      if (position.y < 0) {
        this.isPullDownDisabled = true;
      } else {
        this.isPullDownDisabled = false;
      }
    },
    //上拉操作
    pullUpFresh() {
      this.freshType = "pull-up";
      setTimeout(() => {
        this.getArticleListMethod();
      }, 1000); //上拉加载动画过程延迟时间
    },
    //下拉操作
    pullDownFresh() {
      this.freshType = "pull-down";
      setTimeout(() => {
        this.getArticleListMethod();
      }, 1000); //下拉加载动画过程延迟时间
    },
  },
};
</script>
<style lang='less' scoped>
.home {
  width: 100vw;
  height: calc(100vh - 46px);
  .scroll-out {
    height: 100%;
    .scroll-out-wrapper {
      height: 100vh;
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
      .tabs {
        .tabs-placeholder {
          width: 80px;
        }
        .scroll-in {
          position: relative;
          width: 100vw;
          height: calc(100vh - 46px - 50px);
          background-color: #f1f2f7;
          .pull-down-refresh {
            .huaji {
              position: absolute;
              width: 30px;
              height: 30px;
              top: 50%;
              margin-left: -15px;
              transform: translateY(-50%);
            }
            .pull-refresh-success {
              width: 100%;
              height: 30px;
              font-size: 12px;
              background-color: rgb(88, 104, 252);
              color: white;
              text-align: center;
              line-height: 30px;
            }
            .div-test {
              width: 100%;
              height: 300px;
              background-color: rgb(175, 90, 90);
              margin-bottom: 5px;
            }
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
  }
}
</style>