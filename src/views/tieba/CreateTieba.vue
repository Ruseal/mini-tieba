<template>
  <div class="create-tieba">
    <div class="nav">
      <left-arrow @click.native="$router.back()" class="arrow" />
      <div>创建贴吧</div>
      <div></div>
    </div>
    <div class="text">给贴吧取一个好听的名字吧</div>
    <div class="ipt-wrapper">
      <input @focus="clearPrompt" v-model="value" type="text" />
    </div>
    <div v-show="isShow" class="prompt">贴吧名已存在</div>
    <van-button
      @click="onCreate"
      class="button"
      type="primary"
      :disabled="!value || value.length > 10"
      size="large"
      >创建</van-button
    >
  </div>
</template>

<script>
import { createTieba, createTiebaArticle } from "../../api/tieba-net";
import loading from "../../utils/loading";
import LeftArrow from "../../components/common/LeftArrow.vue";
export default {
  name: "",
  components: { LeftArrow },
  data() {
    return {
      value: "",
      isShow: false,
      title: "欢迎创建",
      text: "",
    };
  },
  methods: {
    async onCreate() {
      loading(this);
      try {
        const { status, service } = await createTieba(this.value);
        if (status === 400) {
          this.isShow = true;
          this.$toast.clear();
          return;
        }
        if (status === 401) {
          this.$router.replace({ name: "login-user" });
          this.$toast.fail("登入已过期");
        }
        if (status !== 200) throw new Error();
        if (await this.createArticle(service.insertId)) throw new Error();
        this.$toast.success("创建贴吧成功");
        this.$router.replace({
          name: "tieba",
          query: {
            tid: service.insertId,
          },
        });
      } catch (error) {
        this.$toast.fail("创建失败");
      }
    },
    async createArticle(tiebaId) {
      try {
        const { status } = await createTiebaArticle(
          tiebaId,
          this.title + this.value + "吧！",
          this.text
        );
        if (status !== 200) throw new Error();
      } catch (err) {
        return true;
      }
    },
    clearPrompt() {
      this.isShow = false;
    },
  },
};
</script>
<style lang='less' scoped>
.create-tieba {
  width: 100vw;
  height: 100vh;
  background-color: rgb(255, 255, 255);
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 46px;
    .arrow {
      margin-left: 10px;
    }
  }
  .text {
    margin-top: 40%;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
  }
  .ipt-wrapper {
    width: 100%;
    height: 50px;
    padding: 2px 10px;
    margin-top: 10px;
    background-color: rgb(255, 255, 255);
    input {
      width: 100%;
      height: 100%;
      padding: 0 10px;
      border: unset;
      border-radius: 10px;
      background-color: rgb(240, 240, 240);
    }
  }
  .prompt {
    margin-left: 10px;
    font-size: 12px;
    color: red;
  }
  .button {
    position: absolute;
    width: 90%;
    height: 40px;
    background-color: rgb(97, 160, 255);
    margin-left: 50%;
    border-radius: 40px;
    transform: translateX(-50%);
    bottom: 10px;
    padding: 0 10px;
  }
}
</style>