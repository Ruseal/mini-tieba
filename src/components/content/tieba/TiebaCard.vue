<template>
  <div class="tieba-card" v-if="Object.keys(tiebaMsg).length">
    <div class="left">
      <img
        @click="onTiebaAvatar"
        :src="
          tiebaMsg.avatar ||
          require('@/assets/img/common/default/tieba_default.png')
        "
        alt=""
      />
      <div class="message">
        <h1>{{ tiebaMsg.tiebaName }}吧</h1>
        <div v-show="tiebaMsg.cardMsg.isFocus" class="level">
          <div class="count">
            LV{{
              tiebaMsg.cardMsg.level ? tiebaMsg.cardMsg.level : 1
            }}&nbsp;&nbsp;会员双倍经验
          </div>
          <div class="exp" ref="expWrapperRef"><div ref="expRef"></div></div>
        </div>
        <div v-show="!tiebaMsg.cardMsg.isFocus" class="not-focus">
          关注&nbsp;&nbsp;{{
            tiebaMsg.focusCount
          }}&nbsp;&nbsp;&nbsp;贴子&nbsp;&nbsp;{{ tiebaMsg.commentCount }}
        </div>
        <div class="card-bottom" v-if="tiebaMsg.maxAuth">
          <img
            :src="
              tiebaMsg.maxAuth.avatar ||
              require('@/assets/img/common/default/user_default.jpg')
            "
            alt=""
          />
          <div class="name">
            {{
              tiebaMsg.maxAuth.nickname
                ? tiebaMsg.maxAuth.nickname
                : tiebaMsg.maxAuth.username
            }}
          </div>
          <div class="tag">吧主</div>
        </div>
        <div class="card-bottom" v-else>立即申请吧主</div>
      </div>
    </div>
    <div
      v-if="!tiebaMsg.cardMsg || !tiebaMsg.cardMsg.isFocus"
      class="right"
      @click="onfocus"
    >
      关注
    </div>
    <div v-else class="right" @click="onSigned">
      {{ isSigned() ? "已签到" : "签到" }}
    </div>
  </div>
</template>

<script>
import { updateSign } from "@/api/tieba-net";
import mixins from "@/mixins/mixin";
export default {
  name: "",
  components: {},
  mixins: [mixins],
  data() {
    return {};
  },
  props: {
    tiebaMsg: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    isSigned() {
      return () => {
        if (localStorage.getItem("sign-time" + this.tiebaMsg.id)) {
          if (
            parseInt(localStorage.getItem("sign-time" + this.tiebaMsg.id)) +
              1000 * 60 * 60 * 24 >=
            new Date().getTime()
          ) {
            return true;
          } else {
            return false;
          }
        }
        return false;
      };
    },
  },
  mounted() {
    setTimeout(() => {
      this.$refs.expRef && this.domHandle();
    }, 500);
  },
  methods: {
    domHandle() {
      this.$refs.expRef.style.cssText = `width:${this.tiebaMsg.cardMsg.exp}%;transition: 0.5s;`;
    },
    async onSigned() {
      if (!this.isSigned()) {
        try {
          const { status } = await updateSign(
            this.tiebaMsg.id,
            (this.tiebaMsg.cardMsg.level ? this.tiebaMsg.cardMsg.level : 1) + 1,
            this.tiebaMsg.cardMsg.exp + 3
          );
          if (status !== 200) throw new Error();
          this.$toast.success("经验+3");
          localStorage.setItem(
            "sign-time" + this.tiebaMsg.id,
            new Date().getTime()
          );
          this.isSigned();
          this.tiebaMsg.cardMsg.level += 1;
          this.tiebaMsg.cardMsg.level -= 1;
          this.annimount();
        } catch (err) {
          this.$toast.fail("网络错误，签到失败!");
        }
        return;
      }
      this.$toast("24小时后可再次签到");
    },
    onfocus() {
      if (!this.tiebaMsg.yourUserId) {
        this.$router.replace({ name: "login-user" });
        return;
      }
      this.focusTiebaMethod();
    },
    annimount() {
      let expDom = this.$refs.expRef;
      expDom.style.cssText = `width:${100}%;transition: 2s;`;
      setTimeout(() => {
        expDom.style.cssText = `width:${0}%;transition: 0s;`;
        setTimeout(() => {
          this.tiebaMsg.cardMsg.level
            ? (this.tiebaMsg.cardMsg.level += 1)
            : (this.tiebaMsg.cardMsg.level = 2);
          this.tiebaMsg.cardMsg.exp += 3;
          expDom.style.cssText = `width:${
            (this.tiebaMsg.cardMsg.exp /
              Math.pow(10, (this.tiebaMsg.cardMsg.exp + "").length)) *
            100
          }%;transition: 2s;`;
        }, 50);
      }, 2000);
    },
    onTiebaAvatar() {
      this.$emit("onavatar");
    },
  },
};
</script>
<style lang='less' scoped>
.tieba-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100px;
  padding: 0 10px;
  .left {
    display: flex;
    img {
      width: 65px;
      height: 63px;
      border: 3px solid white;
      border-radius: 25px;
      object-fit: cover;
      object-position: center;
    }
    .message {
      color: white;
      margin-left: 15px;
      h1 {
        color: white;
        font-size: 16px;
      }
      .level {
        margin-top: 5px;
        margin-bottom: 10px;
        .count {
          font-size: 11px;
          margin-bottom: 5px;
          letter-spacing: 1px;
        }
        .exp {
          position: relative;
          width: 100px;
          height: 2px;
          background-color: #fff;
          div {
            position: absolute;
            height: 2px;
            width: 0px;

            background-color: rgb(100, 97, 255);
          }
        }
      }
      .not-focus {
        font-size: 12px;
        margin-top: 3px;
      }
      .card-bottom {
        display: flex;
        align-items: center;
        margin-top: 5px;
        font-size: 10px;
        img {
          width: 16px;
          height: 16px;
          border: 8px;
          margin-right: 5px;
        }
        .name {
          font-size: 11px;
          margin-right: 5px;
        }
        .tag {
          padding: 0 5px;
          height: 15px;
          border-radius: 5px;
          text-align: center;
          line-height: 15px;
          font-size: 9px;
          color: white;
          background-color: rgba(129, 129, 129, 0.3);
        }
      }
    }
  }
  .right {
    // width: 50px;
    padding: 0 13px;
    height: 25px;
    border-radius: 15px;
    text-align: center;
    line-height: 25px;
    font-size: 13px;
    background-color: #fff;
  }
}
</style>