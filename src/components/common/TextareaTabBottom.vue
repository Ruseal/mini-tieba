<template>
  <div class="textarea-tab">
    <div class="icon-wrapper">
      <img
        @touchend="img"
        :src="
          isImg
            ? require('@/assets/img/common/textarea-icon/img-icon.png')
            : require('@/assets/img/common/textarea-icon/img-icon-gray.png')
        "
        alt=""
      />
      <img
        @touchend="expression"
        src="@/assets/img/common/textarea-icon/expression.png"
        alt=""
      />
      <img
        @touchend="aite"
        src="@/assets/img/common/textarea-icon/aite.png"
        alt=""
      />
      <img src="@/assets/img/common/textarea-icon/mic-gray.png" alt="" />
      <img src="@/assets/img/common/textarea-icon/gift-gray.png" alt="" />
    </div>
    <img
      @touchend="clear"
      class="tab-right-claer"
      src="@/assets/img/detail/backspace.png"
      alt=""
    />
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
    isImg: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  methods: {
    img() {
      if (!this.isImg) return;
      this.$emit("onimg");
    },
    expression() {
      this.$toast("暂时不支持发送表情");
    },
    aite() {
      this.$toast("暂时不支持艾特用户");
    },
    clear(){
      this.$emit('clear-text')
    }
  },
};
</script>
<style lang='less' scoped>
.textarea-tab {
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  right: 10px;
  left: 10px;
  height: 35px;
  bottom: 0;
  .icon-wrapper {
    display: flex;
    img {
      width: 22px;
      height: 20px;
      margin-right: 40px;
    }
  }
  .tab-right-claer {
    width: 30px;
    height: 20px;
    margin-right: 10px;
    border-left: 1px solid rgba(201, 199, 199, 0.5);
    box-sizing: content-box;
    padding-left: 10px;
  }
}
</style>