<template>
  <div class="input-box">
    <div class="wrapper-box">
      <input
        v-model="value"
        @focus="focus"
        @blur="blur"
        @input="input"
        class="ipt"
        :type="inputType"
        ref="iptRef"
        :placeholder="placeholder"
      />
      <img
        v-if="eyes"
        class="eyes"
        @click="toggleEyes"
        :src="
          isShowEyes
            ? require('@/assets/img/login/show_eyes.png')
            : require('@/assets/img/login/hide_eyes.png')
        "
      />
      <div
        v-if="clear"
        @touchstart="clearValue"
        v-show="isShowClaer"
        class="clear"
      >
        ×
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      value: "",
      isShowClaer: false,
      isShowEyes: false,
      inputType: this.type,
    };
  },

  props: {
    type: {
      type: String,
      default() {
        return "text";
      },
    },
    eyes: {
      type: Boolean,
      default() {
        return false;
      },
    },
    clear: {
      type: Boolean,
      default() {
        return false;
      },
    },

    placeholder: {
      type: String,
      default() {
        return "";
      },
    },
  },
  methods: {
    clearValue() {
      this.value = "";
      this.input();
    },
    focus() {
      if (this.value) {
        this.$emit("clear-error-text");
        this.isShowClaer = true;
      }
    },
    blur() {
      this.isShowClaer = false;
    },
    input() {
      this.$emit("input-value", this.value);
      if (this.value) {
        this.isShowClaer = true;
      } else {
        this.isShowClaer = false;
      }
    },
    toggleEyes() {
      this.isShowEyes = !this.isShowEyes;
      if (this.isShowEyes) {
        this.inputType = "text";
      } else {
        this.inputType = "password";
      }
    },
  },
};
</script>
<style lang='less' scoped>
.input-box {
  .wrapper-box {
    position: relative;
    width: 90%;
    height: 50px;
    border-radius: 25px;
    margin: auto;
    background-color: #f5f5f5;
    padding: 10px 45px;
    .ipt {
      width: 100%;
      height: 100%;
      text-align: center;
      border: none;
      background-color: #f5f5f5;
      animation: flashing 1s infinite;
    }
    .eyes {
      position: absolute;
      width: 16px;
      height: 16px;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
    }
    .clear {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      border-radius: 10px;
      text-align: center;
      font-size: 22px;
      line-height: 22px;
      color: white;
      background-color: #c4c4c4;
    }
  }
}
@keyframes flashing {
  0%,
  100% {
    caret-color: #000;
  }
  50% {
    caret-color: rgb(250, 245, 245, 0);
    caret-color: #000;
  }
}
input::-webkit-input-placeholder {
  color: #b8b8b8;
}
input::-moz-placeholder {
  color: #b8b8b8;
}
input:-moz-placeholder {
  color: #b8b8b8;
}
input:-ms-input-placeholder {
  color: #b8b8b8;
}
</style>