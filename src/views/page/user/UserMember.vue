<template>
  <div class="user-member">
    <van-nav-bar title="会员中心" class="nav-bar">
      <left-arrow slot="left" @click.native="$router.back()" />
    </van-nav-bar>
    <div class="container">
      <div class="member-top">
        <img
          class="avatar"
          :src="
            userMsg.avatar
              ? userMsg.avatar
              : require('../../../assets/img/common/user-avatar/b.jpg')
          "
          alt=""
        />
        <div class="user-name">
          <h2 :class="{ 'font-color': !!userMsg.members }">
            {{ userMsg.nickname ? userMsg.nickname : userMsg.username }}
          </h2>
          <img
            :src="
              userMsg.members
                ? require('../../../assets/img/common/members/members_line.png')
                : require('../../../assets/img/common/members/members.png')
            "
            alt=""
          />
          <img
            class="member-icon"
            :src="
              userMsg.members
                ? require('../../../assets/img/user/vip-red.png')
                : require('../../../assets/img/user/vip-gray.png')
            "
            alt=""
          />
        </div>
        <p>{{ userMsg.members ? "您已成为会员啦" : "您还不是会员" }}</p>
      </div>
      <van-button
        class="button"
        type="default"
        size="large"
        @click="memberPopup(true)"
        >{{ userMsg.members ? "续费贴吧会员" : "开通贴吧会员" }}</van-button
      >
      <div class="cell-wrapper">
        <h1>会员特权</h1>
        <p>成为会员尊享精华特权</p>
        <div class="cell-list">
          <div v-for="item in privilegeList" :key="item.id" class="list-item">
            <img v-if="item.url" :src="item.url" alt="" />
            <p>{{ item.name }}</p>
          </div>
        </div>
      </div>
    </div>
    <van-popup
      class="popup"
      v-model="isShowMemberPopup"
      position="bottom"
      :style="{ height: '80%' }"
      :close-on-click-overlay="false"
      @click-overlay="clickOverlay"
    >
      <van-nav-bar class="nav-img">
        <div class="title" slot="title">
          <img
            src="../../../assets/img/common/members/members_line.png"
            alt=""
          />
          &nbsp;
          <p>贴吧会员</p>
        </div>
        <img
          slot="left"
          @click="memberPopup(false)"
          src="../../../assets/img/common/tieba-avatar/exit_highlight.png"
          alt=""
        />
      </van-nav-bar>
      <div class="price-wrapper">
        <div class="wrapper">
          <div
            class="price-item"
            :class="{ active: togglePrice === index }"
            @click="changePrice({ index, price: item.price })"
            v-for="(item, index) in priceList"
            :key="index"
          >
            <div class="price"><span>￥</span>&nbsp;{{ item.price }}</div>
            <p>{{ item.msg }}</p>
            <p class="time">{{ item.time }}</p>
          </div>
        </div>
      </div>
      <van-button
        class="member-button"
        @click="openMember"
        type="default"
        size="large"
        >应付{{ price }}元</van-button
      >
    </van-popup>
  </div>
</template>

<script>
import { openMember } from "../../../api/user-net";
import LeftArrow from "../../../components/common/LeftArrow.vue";
import loading from "../../../utils/loading";
export default {
  name: "",
  components: { LeftArrow },
  data() {
    return {
      userMsg: [],
      privilegeList: [
        {
          id: 1,
          url: require("../../../assets/img/user/privilege-icon/grow.png"),
          name: "成长体系",
        },
        {
          id: 2,
          url: require("../../../assets/img/user/privilege-icon/dress_font.png"),
          name: "装扮特权",
        },
        {
          id: 3,
          url: require("../../../assets/img/user/privilege-icon/fast_sign.png"),
          name: "一键签到",
        },
        {
          id: 4,
          url: require("../../../assets/img/user/privilege-icon/honorable.png"),
          name: "尊贵身份",
        },
        {
          id: 5,
          url: require("../../../assets/img/user/privilege-icon/more_privilege.png"),
          name: "更多特权",
        },
        {},
      ],
      isShowMemberPopup: false,
      togglePrice: 3,
      price: 30,
      priceList: [
        {
          price: 180,
          time: "12个月",
          msg: "超值特惠",
        },
        {
          price: 176,
          time: "6个月",
        },
        {
          price: 88,
          time: "3个月",
        },
        {
          price: 30,
          time: "1个月",
        },
      ],
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.userMsg = this.$route.query.userMsg;
    },
    memberPopup(isShow) {
      if (this.userMsg.members) {
        this.$toast("暂不支持会员续费");
        return;
      }
      this.isShowMemberPopup = isShow;
    },
    clickOverlay() {
      this.memberPopup(false);
    },
    changePrice(event) {
      this.togglePrice = event.index;
      this.price = event.price;
    },
    async openMember() {
      if (this.userMsg.members) {
        this.$toast("您已是会员");
        return;
      }
      loading(this);
      try {
        const { status } = await openMember();
        if (status !== 200) throw new Error();
        this.userMsg.members = true;
        setTimeout(() => {
          this.$toast.success("开通会员成功");
          this.isShowMemberPopup = false;
        }, 1000);
      } catch (error) {
        this.$toast.fail("网络错误，稍后重新尝试");
      }
    },
  },
};
</script>
<style lang='less' scoped>
.user-member {
  .nav-bar {
    position: relative;
    background-color: rgba(255, 255, 255, 0);
    /deep/ .van-nav-bar__title {
      font-size: 14px;
    }
  }

  .container {
    position: fixed;
    top: 0;
    overflow-y: auto;
    width: 100vw;
    height: 100vh;
    .member-top {
      width: 100vw;
      height: 200px;
      background: url("../../../assets/img/user/member-bgc.jpeg") no-repeat;
      background-size: 100% 100%;
      .avatar {
        width: 83px;
        height: 80px;
        object-fit: cover;
        object-position: center;
        border-radius: 40px;
        border: 5px solid rgba(241, 255, 251, 0.8);
        margin-left: 50%;
        margin-top: 60px;
        transform: translateX(-50%);
      }
      .user-name {
        display: flex;
        justify-content: center;
        align-items: center;
        h2 {
          text-align: center;
          font-size: 16px;
          margin-right: 5px;
        }
        .font-color {
          color: rgb(243, 38, 38);
        }
        img:nth-of-type(1) {
          width: 18px;
          height: 15px;
          margin-right: 5px;
        }
        img:nth-of-type(2) {
          width: 30px;
          height: 15px;
        }
      }
      p {
        text-align: center;
        font-size: 12px;
        margin-top: 10px;
        color: rgb(109, 109, 109);
      }
    }
    .button {
      margin-top: 30px;
      height: 40px;
      width: 80%;
      margin-left: 50%;
      transform: translateX(-50%);
      background-color: rgb(255, 123, 0);
      color: white;
    }
    .cell-wrapper {
      padding: 10px;
      h1 {
        font-size: 16px;
        text-align: center;
      }
      p {
        margin-top: 5px;
        font-size: 12px;
        text-align: center;
        color: rgb(155, 155, 155);
      }
      .cell-list {
        display: flex;
        justify-content: space-between;

        align-content: space-around;
        flex-wrap: wrap;
        width: 100%;
        height: 230px;
        .list-item {
          text-align: center;
          width: 30%;
          height: 100px;
          img {
            margin-top: 20%;
            width: 35px;
            height: 35px;
          }
        }
      }
    }
  }
  .popup {
    width: 100vw;
    padding: 10px;
    /deep/ .van-nav-bar__title {
      font-weight: 600;
      font-size: 15px;
    }
    .nav-img {
      .title {
        display: flex;
        align-items: center;
        img {
          width: 15px;
          height: 15px;
        }
      }
      img {
        width: 13px;
        height: 13px;
      }
    }
    .price-wrapper {
      margin-top: 10px;
      position: fixed;
      width: 100vw;
      height: 130px;
      overflow-x: auto;
      .wrapper {
        width: 130vw;
        height: 100%;
        display: flex;
        justify-content: space-between;
        padding-right: 20px;
        .price-item {
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: center;
          width: 30vw;
          height: 100%;
          border: 1px solid rgb(238, 238, 238);
          border-radius: 5px;
          div,
          p {
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 1;
          }
          .price {
            font-size: 22px;
            font-weight: 700;
            color: rgb(247, 16, 16);
            span {
              font-size: 14px;
            }
          }
          p:nth-of-type(1) {
            flex: 0.3;
            margin-top: -20px;
            font-size: 12px;
            color: rgb(182, 182, 182);
          }
          p:nth-of-type(2) {
            color: unset;
          }
        }
        .active {
          border: 1px solid rgb(253, 123, 16);
          background-color: rgb(250, 231, 201);
        }
      }
    }
    .member-button {
      position: absolute;
      bottom: 10px;
      width: calc(100% - 20px);
      height: 45px;
      background-color: rgb(255, 123, 0);
      color: white;
    }
  }
}
</style>