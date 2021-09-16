<template>
  <div class="login-component">
    <van-nav-bar class="login-nav" :title="loginNavTitle">
      <div slot="left"><left-arrow @click.native="onClickNavLeft" /></div>
    </van-nav-bar>
    <div class="scroll">
      <div class="login-card">
        <h2 class="login-title">
          {{
            ["/register-user", "/register-set-password"].includes(
              currentRoutePath
            )
              ? "欢迎注册百度账号"
              : "登入百度账号&nbsp;&nbsp;精彩永相随"
          }}
        </h2>
        <input-box
          @input-value="firstInput"
          @clear-error-text="clearErrorText"
          clear
          :placeholder="
            ['/login-user', '/login-input-password'].includes(currentRoutePath)
              ? '请输入你的用户名'
              : '创建你的用户名'
          "
          ref="loginUserRef"
        />
        <input-box
          @input-value="secondInput"
          @clear-error-text="clearErrorText"
          v-if="
            ['/login-input-password', '/register-set-password'].includes(
              currentRoutePath
            )
          "
          type="password"
          class="input-box-margin"
          clear
          eyes
          :placeholder="
            currentRoutePath === '/login-input-password'
              ? '请输入登入密码'
              : '设置登入密码'
          "
        />
        <input-box
          @input-value="thirdInput"
          @clear-error-text="clearErrorText"
          v-if="currentRoutePath === '/register-set-password'"
          type="password"
          class="input-box-margin"
          clear
          eyes
          placeholder="确认设置密码"
          ref="registerSetPasswordRef"
        />
        <div
          v-if="
            ['/login-input-password', '/register-set-password'].includes(
              currentRoutePath
            )
          "
          class="login-prompt"
        >
          <div>
            {{ fromErrPrompt }}
          </div>
          <div>忘记密码</div>
        </div>
        <van-button
          class="login-btn"
          type="primary"
          size="large"
          color="#4e6ef2"
          :disabled="isBtnDisabled"
          round
          @click="clickBtnMethod"
        >
          {{ btnTextName }}
        </van-button>

        <div class="login-agreement">
          <p>短信验证码</p>
          <p>
            <span>
              <input
                @click="setRouterChecked"
                v-model="checked"
                type="checkbox"
              />
            </span>
            请同意并阅读&nbsp;
            <a href="#">百度用户协议</a>&nbsp;和&nbsp;
            <a href="#">隐私政策</a>
          </p>
        </div>

        <div class="bottom-register">
          <span
            v-if="
              ['/login-input-password', '/register-set-password'].includes(
                currentRoutePath
              )
            "
            @click="
              $router.push({
                name: 'login-user',
                params: { routerCheck: checked },
              })
            "
            >换个账号</span
          >
          <span @click="clickBottomRegister">{{
            ["/register-user", "/register-set-password"].includes(
              currentRoutePath
            )
              ? "登入"
              : "注册"
          }}</span
          ><span>帮助</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { routerType, clickBtnHandle } from "../../methods/login-methods";
import * as LoginConstant from "../../constant/login-constant";

import LeftArrow from "./LeftArrow.vue";
import InputBox from "./InputBox.vue";

export default {
  name: "",
  components: {
    LeftArrow,
    InputBox,
  },
  data() {
    return {
      currentRoutePath: "", //当前路由
      loginNavTitle: "", //顶部栏标题
      isBtnDisabled: true, //按钮是否禁用
      btnTextName: "", //按钮文本
      checked: false, //设置保存路由参数
      userNameValue: "", //输入的用户名值
      passwordValue: "", //输入的用户密码值
      setPasswordValue: "", //输入的确让密码值
      userNameReg: LoginConstant.USER_NAME_FORMAT, //用户名正则格式格式
      passwordReg: LoginConstant.PASSWORD_FORMAT, //用户密码正则格式格式
      fromErrPrompt: "", //错误信息提示文本
      inputAssignment: true, //输入框是否有值
    };
  },
  mounted() {
    this.currentRoutePath = this.$route.path;
    this.routerTypeMethod();
  },
  methods: {
    routerTypeMethod() {
      //页面渲染后判断当前的路由
      routerType(this);
    },
    clickBtnMethod() {
      // 点击表单按钮后的操作
      clickBtnHandle(this);
    },
    setRouterChecked() {
      if (!this.checked) {
        this.$route.params.routerCheck = true;
      }
    },
    clickBottomRegister() {
      if (
        ["/register-user", "/register-set-password"].includes(
          this.currentRoutePath
        )
      ) {
        this.$router.push({
          name: "login-user",
          params: {
            routerCheck: this.checked,
          },
        });
      } else {
        this.$router.push({
          name: "register-user",
          params: {
            routerCheck: this.checked,
          },
        });
      }
    },
    firstInput(value) {
      this.userNameValue = value.replace(/\s/g, "");
      this.routerTypeMethod();
    },
    secondInput(value) {
      this.passwordValue = value.replace(/\s/g, "");
      this.routerTypeMethod();
    },
    thirdInput(value) {
      this.setPasswordValue = value.replace(/\s/g, "");
      this.routerTypeMethod();
    },
    clearErrorText() {
      this.fromErrPrompt = "";
    },
    onClickNavLeft() {
      if (this.$route.path !== "/login-user") {
        this.$router.back();
        return;
      }
      this.$router.replace("/page/home");
    },
  },
};
</script>
<style lang='less' scoped>
.login-component {
  width: 100vw;
  height: 100vh;
  .scroll {
    position: fixed;
    width: 100vw;
    top: 46px;
    overflow-y: auto;
    height: calc(100vh - 46px);
    background: linear-gradient(
      360deg,
      rgb(235, 232, 232) 70%,
      rgb(47, 77, 247) 80%
    );
    .login-card {
      position: absolute;
      width: 95vw;
      height: 430px;
      border-radius: 15px;
      top: 90px;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgb(255, 251, 251);
      .login-title {
        text-align: center;
        line-height: 60px;
        font-size: 20px;
      }
      .input-box-margin {
        margin: 15px 0;
      }
      .login-prompt {
        display: flex;
        justify-content: space-between;
        margin: 10px 0 15px 0;
        padding: 0 20px;
        div {
          font-size: 13px;
        }
        div:nth-child(1) {
          max-width: 75%;
          font-size: 10px;
          color: rgb(250, 6, 6);
        }
      }
      .login-btn {
        width: 90%;
        margin: 10px 0 0 50%;
        transform: translateX(-50%);
      }
      .login-agreement {
        text-align: center;
        margin-top: 10px;
        p:nth-child(1) {
          line-height: 40px;
          font-size: 13px;
        }
        p:nth-child(2) {
          font-size: 13px;
          color: #cbcbcb;
          span input {
            position: relative;
            top: 2px;
          }
          a {
            font-size: 13px;
            color: #b9b9b9;
          }
        }
      }
      .bottom-register {
        position: absolute;
        bottom: -100px;
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 12px;
        span {
          font-size: 13px;
          padding: 0 15px;
          color: #8e8e8e;
          border-right: 1px solid #a2a2a2;
        }
        span:last-child {
          border-right: unset;
        }
      }
    }
  }
}
</style>