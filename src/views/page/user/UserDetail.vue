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
        <img
          class="avatar"
          :src="
            userData.detail.avatar ||
            require('@/assets/img/common/default/user_default.jpg')
          "
        />
        <div class="edit" v-if="userData.detail.isSelf" @click="toUserEdit">
          编辑资料
        </div>
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
        <img
          :src="
            userData.detail.member
              ? require('@/assets/img/common/members/members_line.png')
              : require('@/assets/img/common/members/members.png')
          "
          alt=""
        />
        <div :class="{ 'font-color': userData.detail.member }">
          {{
            userData.detail.nickname
              ? userData.detail.nickname
              : userData.detail.username
          }}
        </div>
        <div class="gender" v-if="userData.detail.gender !== null">
          <img
            :src="
              userData.detail.gender === '男'
                ? require('@/assets/img/common/gender/man.png')
                : require('@/assets/img/common/gender/woman.png')
            "
            alt=""
          />
        </div>
      </div>
      <div class="msg">
        <div>ID:{{ userData.detail.id }}</div>
        <div>用户名:&nbsp;{{ userData.detail.username }}</div>
        <div>吧龄:&nbsp;{{ formatYear(userData.detail.createTime) }}</div>
      </div>
      <div class="intrdt">
        <div class="text">
          {{
            userData.detail.introduction
              ? userData.detail.introduction
              : "这个人很懒，什么也没有留下。"
          }}
        </div>
        <left-arrow />
      </div>
      <div class="numerical">
        <div>{{ userData.detail.likeCount }}<span>获赞</span></div>
        <div @click="toUserTypeList('focus')">
          {{ userData.detail.focusCount }}<span>关注</span>
        </div>
        <div @click="toUserTypeList('fans')">
          {{ userData.detail.fansCount }}<span>粉丝</span>
        </div>
        <div @click="toUserTypeList('tieba')">
          {{ userData.detail.tiebaCount }}<span>吧</span>
        </div>
      </div>
      <div class="member">
        <div class="left">
          <img
            :src="
              userData.detail.member
                ? require('@/assets/img/common/members/members_line.png')
                : require('@/assets/img/common/members/members.png')
            "
            alt=""
          />
          <div class="text">
            {{
              userData.detail.isSelf
                ? userData.detail.member
                  ? "我的会员"
                  : "暂无会员"
                : "TA的会员"
            }}
          </div>
        </div>
        <div class="right" @click="toMember">
          <div class="text">
            {{
              userData.detail.isSelf
                ? userData.detail.member
                  ? "查看"
                  : "去获得"
                : userData.detail.member
                ? ""
                : "暂无"
            }}
          </div>
          <left-arrow v-if="userData.detail.isSelf" />
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
        :user-detail-click="false"
      />
    </scroll>
  </div>
</template>

<script>
import { getUserDetail } from "@/api/user-net";
import formatYear from "@/utils/format-year";
import mixins from "@/mixins/mixin";
import ArticleItem from "@/components/common/ArticleItem.vue";
import Error from "@/components/common/Error.vue";
import LeftArrow from "@/components/common/LeftArrow.vue";
import Loading from "@/components/common/Loading.vue";
import Scroll from "@/components/common/Scroll.vue";
export default {
  name: "user-detail",
  components: { LeftArrow, Scroll, Loading, Error, ArticleItem },
  mixins: [mixins],
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
      return formatYear();
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
        this.freshScroll();
      } catch (err) {
        this.statusData = "error";
      }
    },
    freshScroll() {
      this.$nextTick(() => {
        this.$refs.scrollRef.refresh();
      });
    },
    async focusUser() {
      if (this.userData.detail.isFocusUser) {
        if (!(await this.unFocusUserMethod(this.userId))) return;
        this.userData.detail.isFocusUser = false;
      } else {
        if (!(await this.focusUserMethod(this.userId))) return;
        this.userData.detail.isFocusUser = true;
      }
    },
    toUserTypeList(type) {
      this.$router.push({
        name: "user-type-list",
        query: {
          type,
          userId: this.userId,
          isSelf: this.userData.detail.isSelf,
        },
      });
    },
    toUserEdit() {
      this.$router.push({
        name: "user-edit",
        query: {
          userMsg: this.userData.detail,
        },
      });
    },
    toMember() {
      if (!this.userData.detail.isSelf) return;
      this.$router.push({
        name: "user-member",
        query: { isMember: false, userMsg: this.userData.detail },
      });
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
      .font-color {
        color: rgb(243, 38, 38);
      }
      img {
        width: 18px;
        height: 16px;
        margin-right: 3px;
      }
      div {
        font-size: 16px;
        font-weight: 600;
      }
      .gender {
        display: flex;
        width: 18px;
        height: 16px;
        margin-left: 5px;
        align-items: center;
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
        img {
          width: 14px;
          height: 14px;
        }
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