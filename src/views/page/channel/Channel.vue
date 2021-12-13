<template>
  <div class="channel">
    <loading v-if="statusData === 'loading'" />
    <error v-if="statusData === 'error'" />
    <div v-else>
      <div class="wrap">
        <van-swipe class="swipe-wrap" :autoplay="3000">
          <van-swipe-item
            class="swipe-item"
            v-for="(image, index) in banner"
            :key="index"
          >
            <img class="swipe-img" v-lazy="image" />
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="container">
        <div class="title">吧广场分类</div>
        <div class="scroll-wrap">
          <scroll class="left-scroll" click ref="leftScrollRef">
            <div
              class="left-item"
              @click="toggleLeft(index)"
              :class="{ 'left-active': currentIndex === index }"
              v-for="(item, index) in titleList"
              :key="index"
            >
              <div class="text">{{ item }}</div>
            </div>
          </scroll>
          <scroll class="right-scroll" click ref="rightScrollRef">
            <div class="right-scroll-wrap">
              <div
                class="right-item"
                v-for="item in tiebaList"
                :key="item.id"
                @click="toTieba(item.id)"
              >
                <img
                  class="item-img"
                  :src="
                    item.avatar
                      ? item.avatar
                      : require('@/assets/img/common/default/tieba_default.png')
                  "
                  alt=""
                />
                <div class="name">{{ item.name }}吧</div>
                <div class="focus">关注 {{ item.focus }}</div>
              </div>
            </div>
          </scroll>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCategoryList, getBanner } from "@/api/tieba-net";
import Error from "@/components/common/Error.vue";
import Loading from "@/components/common/Loading.vue";
import Scroll from "@/components/common/Scroll.vue";
export default {
  name: "channel",
  components: { Scroll, Loading, Error },
  data() {
    return {
      statusData: "loading",
      banner: [],
      categoryList: [],
      titleList: [],
      tiebaList: [],
      currentIndex: 0,
    };
  },
  created() {
    this.getBannerMethod();
    this.getCategoryListMethod();
  },
  methods: {
    async getBannerMethod() {
      try {
        const { status, data } = await getBanner();
        if (status !== 200) throw new Error();
        this.statusData = "ok";
        this.banner = data.banner;
      } catch (err) {
        this.statusData = "error";
      }
    },
    async getCategoryListMethod() {
      try {
        const { status, data } = await getCategoryList();
        if (status !== 200) throw new Error();
        this.statusData = "ok";
        this.categoryList = data;
        this.titleList = this.categoryList.map((item) => item.name);
        this.tiebaList = this.categoryList[this.currentIndex].children;
        this.$nextTick(() => {
          this.$refs.leftScrollRef.refresh();
          this.$refs.rightScrollRef.refresh();
        });
      } catch (err) {
        this.statusData = "error";
      }
    },
    toggleLeft(index) {
      if (index === this.leftCurrentIndex) return;
      this.currentIndex = index;
      this.tiebaList = this.categoryList[this.currentIndex].children;
      this.$refs.rightScrollRef.scrollTo(0, 0, 0);
      this.$nextTick(() => {
        this.$refs.rightScrollRef.refresh();
      });
    },
    toTieba(tiebaId) {
      this.$router.push({
        name: "tieba",
        query: {
          tid: tiebaId,
        },
      });
    },
  },
};
</script>
<style lang='less' scoped>
.channel {
  .wrap {
    width: 97vw;
    height: 150px;
    margin: 2vw auto;
    padding: 10px;
    border-radius: 10px;
    background-color: rgb(237, 244, 245);
    .swipe-wrap {
      width: 100%;
      height: 100%;
      border-radius: 10px;
      .swipe-item {
        .swipe-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }
      }
    }
  }
  .container {
    width: 98vw;
    height: calc(100vh - 4vw - 150px - 50px);
    margin: 0 auto;
    .title {
      padding: 0 0 5px 5px;
      font-size: 14px;
      font-weight: 600;
      border-bottom: 1px solid rgb(235, 235, 235);
    }
    .scroll-wrap {
      display: flex;
      height: calc(100vh - 4vw - 150px - 50px - 25px);
      .left-scroll {
        flex: 1;
        height: 100%;
        background-color: rgb(243, 243, 243);
        .left-item {
          position: relative;
          height: 50px;
          .text {
            position: absolute;
            right: 25px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 13px;
            color: rgb(63, 63, 63);
          }
        }
        .left-active {
          background-color: #fff;
          border-left: 3px solid rgb(24, 21, 233);
          .text {
            color: rgb(0, 0, 0);
          }
        }
      }
      .right-scroll {
        flex: 4;
        height: 100%;
        background-color: #fff;
        .right-scroll-wrap {
          display: flex;
          flex-wrap: wrap;
          .right-item {
            margin-top: 10px;
            text-align: center;
            padding: 10px;
            width: calc(100% / 3);
            height: 120px;

            &:nth-last-of-type(1),
            &:nth-last-of-type(2) {
              margin-bottom: 10px;
            }
            .item-img {
              border-radius: 20px;
              width: 53px;
              height: 50px;
              object-fit: cover;
              object-position: center;
            }
            .name {
              font-size: 13px;
              font-weight: 600;
            }
            .focus {
              margin-top: 3px;
              font-size: 9px;
              color: rgb(194, 194, 194);
            }
          }
        }
      }
    }
  }
}
</style>