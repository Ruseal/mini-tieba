<template>
  <div class="user-message">
    <van-cell class="message" center is-link>
      <div slot="icon" class="icon-avatar">
        <img
          :src="
            userMessage.avatar
              ? userMessage.avatar
              : require('@/assets/img/common/user-avatar/b.jpg')
          "
          alt=""
        />
      </div>
      <div slot="title" class="title">
        <img
          :src="
            userMessage.member
              ? require('@/assets/img/common/members/members_line.png')
              : require('@/assets/img/common/members/members.png')
          "
          alt=""
        />
        <div>
          {{
            userMessage.nickname ? userMessage.nickname : userMessage.username
          }}
        </div>
        <img
          v-if="userMessage.gender !== null"
          :src="
            userMessage.gender
              ? require('@/assets/img/common/gender/man.png')
              : require('@/assets/img/common/gender/woman.png')
          "
          alt=""
        />
      </div>
      <div slot="label" class="label">{{userMessage.indt?userMessage.indt:'这个人很懒，什么也没有留下。'}}</div>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {};
  },
  props: {
    userMessage: {
      type: Object,
      required: true,
    },
  },
};
</script>
<style lang='less' scoped>
.user-message {
  .message {
    .icon-avatar img {
      width: 63px;
      height: 60px;
      object-fit: cover;
      object-position: center;
      box-sizing: content-box;
      border: 3px solid white;
      border-radius: 40px;
      box-shadow: 0 0 15px 2px #e3eef4;
    }
    .title {
      display: flex;
      align-items: center;
      margin-left: 20px;
      color: black;
      img:nth-child(1) {
        width: 20px;
        height: 16px;
      }
      div {
        margin: 0 6px 0 6px;
        font-size: 19px;
        font-weight: 550;
      }
      img:nth-child(3) {
        width: 15px;
        height: 15px;
      }
    }
    .label {
      margin-left: 20px;
      font-size: 10px;
      color: rgb(114, 110, 110);
    }
    .van-cell__right-icon {
      line-height: 7px;
    }
  }
}
</style>