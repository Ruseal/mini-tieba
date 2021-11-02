<template>
  <div class="user-detail">
    <van-nav-bar
      :title="
        userData
          ? userData.detail.nickname
            ? userData.detail.nickname
            : userData.detail.username
          : ''
      "
    >
      <left-arrow slot="left" @click.native="$router.back()" />
    </van-nav-bar>
    <loading v-if="statusData === 'loading'" />
    <error v-else-if="statusData === 'error'" />
    <scroll v-else class="scroll" ref="scrollRef" click>
      <div class="top">
        <img class="avatar" :src="userData.detail.avatar" />
        <div class="edit" v-if="userData.detail.isSelf">编辑资料</div>
        <div
          class="focus"
          :class="{ 'focus-active': userData.detail.isFocusUser }"
          v-else
          @click="focusUser"
        >
          {{ userData.detail.isFocusUser ? "已关注" : "关注" }}
        </div>
      </div>
      <div class="name">
        <img src="../../../assets/img/common/members/members.png" alt="" />
        <div>
          {{
            userData.detail.nickname
              ? userData.detail.nickname
              : userData.detail.username
          }}
        </div>
      </div>
      <div class="msg">
        <div>ID:{{ userData.detail.id }}</div>
        <div>吧龄:&nbsp;{{ formatYear(userData.detail.createTime) }}</div>
        <div>{{ 744 }}</div>
      </div>
      <div class="intrdt">
        <div class="text">
          {{ userData.detail.introduction }}
        </div>
        <left-arrow />
      </div>
      <div class="numerical">
        <div>{{ userData.detail.likeCount }}<span>获赞</span></div>
        <div>{{ userData.detail.focusCount }}<span>关注</span></div>
        <div>{{ userData.detail.fansCount }}<span>粉丝</span></div>
        <div>{{ userData.detail.tiebaCount }}<span>吧</span></div>
      </div>
      <div class="member">
        <div class="left">
          <img src="../../../assets/img/common/members/members.png" alt="" />
          <div class="text">暂无会员</div>
        </div>
        <div class="right">
          <div class="text">去获得</div>
          <left-arrow />
        </div>
      </div>
      <div class="article-tab">
        {{ userData.detail.isSelf ? "我的帖子" : "Ta的贴子" }}
        &nbsp;&nbsp;{{ userData.list.length }}
      </div>
      <article-item
        v-for="item in userData.list"
        :key="item.id"
        :articleItem="item"
        user-label-type="user"
        @image-load="freshScroll"
      />
    </scroll>
  </div>
</template>

<script>
import { getUserDetail } from "../../../api/user-net";
import ArticleItem from "../../../components/common/ArticleItem.vue";
import Error from "../../../components/common/Error.vue";
import LeftArrow from "../../../components/common/LeftArrow.vue";
import Loading from "../../../components/common/Loading.vue";
import Scroll from "../../../components/common/Scroll.vue";
export default {
  name: "user-detail",
  components: { LeftArrow, Scroll, Loading, Error, ArticleItem },
  data() {
    return {
      statusData: "loading",
      userData: null,
      userId: 0,
    };
  },
  created() {
    this.userId = this.$route.params.userId;
  },
  computed: {
    formatYear() {
      return (time) => {
        const num =
          (new Date().getTime() - new Date(time).getTime()) /
          1000 /
          60 /
          60 /
          24 /
          365;
        return Math.round(num * 100) / 100 + "年";
      };
    },
  },
  activated() {
    this.$route.params.userId ? (this.userId = this.$route.params.userId) : "";
    this.getUserDetailMethod();
  },
  methods: {
    async getUserDetailMethod() {
      try {
        const { status, data } = await getUserDetail(this.userId);
        if (status !== 200) throw new Error();
        this.userData = data;
        this.statusData = "ok";
        this.freshScroll()
        console.log(this.userData);
      } catch (err) {
        this.statusData = "error";
      }
    },
    freshScroll() {
      this.$nextTick(() => {
        this.$refs.scrollRef.refresh();
      });
    },
    focusUser() {
      console.log("s");
    },
  },
};
</script>
<style lang='less' scoped>
.user-detail {
  /deep/ .van-nav-bar__title {
    font-size: 14px;
  }
  .scroll {
    width: 100vw;
    padding: 0 10px;
    height: calc(100vh - 46px);
    .top {
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      img {
        width: 84px;
        height: 84px;
        border-radius: 42px;
        object-fit: cover;
        object-position: center;
      }
      .edit {
        padding: 4px 20px;
        border-radius: 20px;
        font-size: 13px;
        color: rgb(20, 16, 255);
        border: 1px solid rgb(133, 112, 255);
      }
      .focus {
        width: 95px;
        padding: 4px 0;
        text-align: center;
        border-radius: 20px;
        font-size: 13px;
        color: white;
        background-color: rgb(46, 65, 240);
      }
      .focus-active {
        color: rgb(136, 135, 135);
        background-color: rgb(233, 233, 233);
      }
    }
    .name {
      padding-top: 15px;
      display: flex;
      align-items: center;
      img {
        width: 18px;
        height: 16px;
        margin-right: 3px;
      }
      div {
        font-size: 16px;
        font-weight: 600;
      }
    }
    .msg {
      padding-top: 15px;
      display: flex;
      align-items: center;
      div {
        font-size: 12px;
        border-right: 1px solid rgb(196, 196, 196);
        color: rgb(143, 143, 143);
        padding-right: 15px;
        padding-left: 15px;
      }
      div:first-child {
        padding-left: unset;
      }
    }
    .intrdt {
      padding-top: 15px;
      width: 100%;
      display: flex;
      align-items: center;
      .text {
        width: 96%;
        font-size: 13px;
        color: rgb(143, 143, 143);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      /deep/ .left-arrow {
        width: 9px;
        height: 9px;
        border-top: 2px solid rgb(122, 122, 122);
        border-left: 2px solid rgb(122, 122, 122);
        transform: rotate(135deg);
      }
    }
    .numerical {
      padding-top: 15px;
      display: flex;
      div {
        font-size: 18px;
        font-weight: 600;
        padding-right: 20px;
        span {
          margin-left: 3px;
          color: rgb(143, 143, 143);
          font-size: 13px;
          font-weight: 500;
        }
      }
    }

    .member {
      margin-top: 15px;
      padding: 15px 0;
      border-top: 1px solid rgba(211, 211, 211, 0.5);
      border-bottom: 1px solid rgba(211, 211, 211, 0.5);
      display: flex;
      justify-content: space-between;
      align-items: center;
      .text {
        font-size: 13px;
      }
      .left {
        display: flex;
        align-items: center;
        img {
          width: 18px;
          height: 16px;
          margin-right: 5px;
        }
      }
      .right {
        display: flex;
        align-items: center;
        /deep/ .left-arrow {
          width: 9px;
          height: 9px;
          border-top: 2px solid rgb(122, 122, 122);
          border-left: 2px solid rgb(122, 122, 122);
          transform: rotate(135deg);
        }
      }
    }

    .article-tab {
      padding: 10px 0;
      font-weight: 600;
      border-bottom: 10px solid rgb(234, 241, 247);
    }
  }
}
</style>