<template>
  <div class="help">
    <van-nav-bar :title="$route.query.title">
      <left-arrow slot="left" @click.native="$router.back()" />
    </van-nav-bar>
    <div class="scroll">
      <div v-if="$route.query.title === '帮助'">
        <div>
          1、用户账号格式1到8位包括为中文或大小写英文字母或数字或‘-’‘@’‘=’‘.’‘~’‘、’在内的特殊字符的字符组成
        </div>
        <div>
          2、用户密码格式为6到16位以非‘_’和‘.’的所有数字大小写英文字母与下划线和点组成
        </div>
        -------------------------------------------------------
        <div>正则表达式为：</div>
        <div>账号：/^[\w\u4e00-\u9fa5-@=.~、]{1,8}$/</div>
        <div>密码：/^(?![_.])[\w.]{6,16}$/</div>
      </div>
      <div class="img" v-if="$route.query.title === '用户账号'">
        <img v-for="(url, index) in imgList" :key="index" :src="url" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import LeftArrow from "../../components/common/LeftArrow.vue";
export default {
  name: "",
  components: { LeftArrow },
  data() {
    return {
      imgList: [
        require("../../assets/img/login/user_msg1.jpg"),
        require("../../assets/img/login/user_msg2.jpg"),
        require("../../assets/img/login/user_msg3.jpg"),
      ],
    };
  },
};
</script>
<style lang='less' scoped>
.help {
  /deep/ .van-nav-bar__title {
    font-size: 14px;
  }
  .scroll {
    position: fixed;
    overflow-y: auto;
    height: calc(100vh - 46px);
    .img {
      img {
        width: 100vw;
      }
    }
  }
}
</style>