<template>
  <div class="user-label">
    <img
      @click="onUserlabel"
      :style="avatarStyle"
      class="avatar"
      :src="
        userLabel.avatar
          ? userLabel.avatar
          : require('@/assets/img/common/user-avatar/b.jpg')
      "
      alt=""
    />
    <div class="center" @click="onUserlabel">
      <div class="title">
        <img
          v-if="isMember"
          v-show="userLabel.member"
          class="member"
          src="@/assets/img/common/members/members_line.png"
          alt=""
        />
        <span
          class="title-name"
          :class="{ 'font-color': isMember && userLabel.member }"
          >{{ userLabel.title }}</span
        >
        <div
          v-if="isFloor"
          v-show="$store.state.currentDetailAuthorId === userLabel.id"
          class="floor-author"
        >
          楼主
        </div>
        <div
          v-if="isMaxAuth"
          v-show="userLabel.authId === userLabel.tiebaMaxAuthId"
          class="floor-max-author"
        >
          吧主
        </div>
        <img v-if="isLevelCard" class="level-card" :src="levelCardImg" alt="" />
        <div
          v-if="isLevelCard"
          class="level_card-text"
          :style="textPosition"
          ref="levelCardTextRef"
        >
          {{ userLabel.level }}
        </div>
      </div>
      <div class="label">
        <div v-if="labelType.includes('floor')" class="floor">
          第{{ userLabel.floor + 2 }}楼&nbsp;&nbsp;&nbsp;
        </div>
        <div v-if="labelType.includes('time')" class="time">
          {{ getTimeDifference(userLabel.createTime) }}
        </div>
        <div v-if="labelType.includes('count')" class="count">
          关注&nbsp;&nbsp;{{ userLabel.focusCount }}&nbsp;
          &nbsp;&nbsp;&nbsp;贴子&nbsp;&nbsp;{{ userLabel.contentCount }}
        </div>
        <div v-if="labelType.includes('article')" class="article">
          [简介]&nbsp;&nbsp;{{ userLabel.introduction }}
        </div>
      </div>
    </div>
    <div class="right">
      <img
        v-if="labelRight === 'exit'"
        @touchend="onRight"
        class="right-icon"
        src="@/assets/img/common/exit.png"
        alt=""
      />
      <div
        v-if="
          ((labelRight === 'focus' && !userLabel.isFocus) ||
            $route.name === 'user-type-list') &&
          $route.query.isSelf
        "
        @click="onRightButton"
        class="right-button"
        ref="rightButtonRef"
      >
        <img
          v-show="focusDom.isShowImg"
          src="@/assets/img/common/add.png"
          alt=""
        />
        <div>{{ focusDom.text }}</div>
      </div>
      <left-arrow v-if="labelRight === 'arrow'" class="left-arrow" />
    </div>
  </div>
</template>

<script>
import mixins from "@/mixins/mixin";
import formatDate from "@/utils/format-date";
import LeftArrow from "./LeftArrow.vue";
import timeDifference from "../../utils/time-difference";
export default {
  name: "",
  components: { LeftArrow },
  mixins: [mixins],
  data() {
    return {
      focusDom: {
        isShowImg: false,
        text: "已关注",
      },
    };
  },
  props: {
    userLabel: {
      type: Object,
      default() {
        return {
          title: "标题名",
        };
      },
    },
    avatarType: {
      type: String,
      default() {
        return "ellipse";
      },
    },
    labelRight: {
      type: String,
      default() {
        return "";
      },
    },
    labelType: {
      type: Array,
      default() {
        return [];
      },
    },
    isMember: {
      type: Boolean,
      default() {
        return false;
      },
    },
    isLevelCard: {
      type: Boolean,
      default() {
        return false;
      },
    },
    isFloor: {
      type: Boolean,
      default() {
        return false;
      },
    },
    isMaxAuth: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  computed: {
    avatarStyle() {
      const style = { borderRadius: "1rem" };
      switch (this.avatarType) {
        case "round":
          style.borderRadius = "1rem";
          break;
        case "ellipse":
          style.borderRadius = "0.3rem";
          break;
        default:
          console.log("avatarStyle is error");
      }
      return style;
    },
    levelCardImg() {
      if (!this.userLabel.level) return;
      if (this.userLabel.level >= 1 && this.userLabel.level < 4) {
        return require("../../assets/img/common/level_card/level_card_green.png");
      } else if (this.aaa >= 4 && this.aaa < 9) {
        return require("../../assets/img/common/level_card/level_card_blue.png");
      } else {
        return require("../../assets/img/common/level_card/level_card_gold.png");
      }
    },
    textPosition() {
      if (!this.userLabel.level) return;
      if (this.userLabel.level > 9) {
        return { marginLeft: "-0.28rem" };
      } else {
        return { marginLeft: "-0.24rem" };
      }
    },
    getTimeDifference() {
      return (time) => {
        return timeDifference(time);
      };
    },
  },
  mounted() {
    if (
      ((this.labelRight === "focus" && !this.userLabel.isFocus) ||
        this.$route.name === "user-type-list") &&
      this.$route.query.isSelf
    ) {
      if (this.userLabel.isFocus) {
        this.$refs.rightButtonRef.style.cssText =
          "background-color: #e3e5e7;font-size:0.3rem";
        this.focusDom.text = "已关注";
      }
    }
  },
  methods: {
    onRight() {
      this.$emit("on-right");
    },
    async onRightButton() {
      if (this.$route.query.type === "tieba") return;
      if (this.$refs.rightButtonRef.innerText === "已关注") {
        if (!(await this.unFocusUserMethod(this.userLabel.authId))) return;
        this.$refs.rightButtonRef.style.cssText =
          "background-color: #e1f6fc;font-size:0.3rem";
        this.focusDom.isShowImg = true;
        this.focusDom.text = "关注";
      } else {
        if (!(await this.focusUserMethod(this.userLabel.authId))) return;
        this.$refs.rightButtonRef.style.cssText =
          "background-color: #e3e5e7;font-size:0.3rem";
        this.focusDom.isShowImg = false;
        this.focusDom.text = "已关注";
      }
    },

    onUserlabel() {
      if (this.userLabel.isTieba) {
        this.$emit("on-label");
        return;
      } else {
        if (this.$route.query.type === "tieba") {
          this.$router.replace({
            name: "tieba",
            query: {
              tid: this.userLabel.authId,
            },
          });
          return;
        }
        this.$router.replace({
          name: "user-detail",
          params: {
            userId: this.userLabel.authId,
          },
        });
      }
    },
  },
};
</script>
<style lang='less' scoped>
.user-label {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 32px;
  background-color: #fff;
  .avatar {
    width: 32px;
    height: 30px;
    margin-right: 10px;
    object-fit: cover;
    object-position: center;
  }
  .center {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    height: 100%;
    margin-left: 0px;

    .title {
      display: flex;
      align-items: center;
      .member {
        width: 12px;
        height: 12px;
        margin-right: 6px;
        margin-top: -2px;
      }
      .title-name {
        font-size: 13px;
      }
      .font-color{
        color: rgb(243, 38, 38);;
      }
      .floor-author {
        width: 28px;
        height: 12px;
        margin-left: 5px;
        font-size: 8px;
        text-align: center;
        line-height: 13px;
        color: white;
        border-radius: 2px;
        background-color: rgb(109, 160, 253);
      }
      .floor-max-author {
        width: 28px;
        height: 12px;
        margin-left: 5px;
        font-size: 8px;
        text-align: center;
        line-height: 13px;
        color: white;
        border-radius: 2px;
        background-color: rgb(245, 157, 57);
      }
      .level-card {
        width: 14px;
        height: 12px;
        margin-left: 5px;
      }
      .level_card-text {
        font-size: 6px;
        font-weight: 300;

        margin-bottom: 1.6px;
        color: white;
      }
    }
    .label {
      display: flex;
      align-items: center;
      div {
        font-size: 10px;
        color: #adadad;
        line-height: 10px;
      }
      .article {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .right {
    position: absolute;
    right: 1px;
    .right-icon {
      width: 10px;
      height: 10px;
    }
    .right-button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 63px;
      height: 26px;
      border-radius: 13px;
      // background-color: #e1f6fc;
      background-color: #e3e5e7;
      font-size: 11px;
      img {
        width: 10px;
        height: 10px;
      }
      div {
        margin-left: 4px;
        // color: #0b88f2;
        font-size: 12px;
        line-height: 26px;
      }
    }
    .left-arrow {
      transform: rotate(135deg);
      width: 9px;
      height: 9px;
      margin-right: 6px;
    }
  }
}
</style>