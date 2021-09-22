import * as LoginConstant from '@/constant/login-constant'
import * as CommonConstant from '@/constant/commom-constant'
import * as StoreConstant from '@/constant/store-constant'
import { userLogin, userRegister } from '@/api/login-net'
import loading from '@/utils/loading'

export const routerType = (_this) => {
  switch (_this.currentRoutePath) {
    case "/login-user": //用户登入输入用户名时路由
      _this.loginNavTitle = LoginConstant.LOGIN_BAIDU_USER;
      _this.btnTextName = LoginConstant.BTN_NEXT_STEP;
      _this.checked = _this.$route.params.routerCheck;
      _this.userNameValue
        ? (_this.isBtnDisabled = false)
        : (_this.isBtnDisabled = true);
      break;
    case "/login-input-password": //用户登入输入用户名和密码时路由
      _this.loginNavTitle = LoginConstant.LOGIN_USER;
      _this.btnTextName = LoginConstant.BTN_LOGIN;
      if (_this.inputAssignment) {
        _this.$refs.loginUserRef.value = _this.$route.params.user;
        _this.userNameValue = _this.$route.params.user;
        _this.inputAssignment = false;
      }
      _this.checked = _this.$route.params.routerCheck;
      _this.userNameValue && _this.passwordValue
        ? (_this.isBtnDisabled = false)
        : (_this.isBtnDisabled = true);
      break;
    case "/register-user": //用户注册输入用户名时路由
      _this.loginNavTitle = LoginConstant.REGISTER_USER;
      _this.btnTextName = LoginConstant.BTN_REGISTER;
      _this.checked = _this.$route.params.routerCheck;
      _this.userNameValue
        ? (_this.isBtnDisabled = false)
        : (_this.isBtnDisabled = true);
      break;
    case "/register-set-password": //用户注册输入用户名并设置密码时路由
      _this.loginNavTitle = LoginConstant.SET_PASSWORD;
      _this.btnTextName = LoginConstant.BTN_DETERMINE_REGISTER;
      _this.checked = _this.$route.params.routerCheck;
      if (_this.inputAssignment) {
        _this.$refs.loginUserRef.value = _this.$route.params.user;
        _this.userNameValue = _this.$route.params.user;
        _this.inputAssignment = false;
      }
      _this.userNameValue && _this.passwordValue && _this.setPasswordValue
        ? (_this.isBtnDisabled = false)
        : (_this.isBtnDisabled = true);
      break;
    default:
      console.error("router is error");
  }
}

export const clickBtnHandle = (_this) => {
  switch (_this.currentRoutePath) {
    case "/login-user":
      if (_this.checked) {
        _this.$router.push({
          name: "login-input-password",
          params: {
            user: _this.userNameValue,
            routerCheck: _this.checked,
          },
        });
      } else {
        _this.$toast(LoginConstant.READ_THE_AGREEMENT);
      }
      break;
    case "/login-input-password":
      if (_this.checked) {
        if (
          _this.userNameReg.test(_this.userNameValue) &&
          _this.passwordReg.test(_this.passwordValue)
        ) {
          userLoginMethod(_this)
          // -------------------------------------
        } else {
          _this.fromErrPrompt = LoginConstant.USERNAME_AND_PASSWORD_FORMAT_ERROR;
        }
      } else {
        _this.$toast(LoginConstant.READ_THE_AGREEMENT);
      }
      break;
    case "/register-user":
      if (_this.checked) {
        _this.$router.push({
          name: "register-set-password",
          params: {
            user: _this.userNameValue,
            routerCheck: _this.checked,
          },
        });
      } else {
        _this.$toast(LoginConstant.READ_THE_AGREEMENT);
      }
    case "/register-set-password":
      if (_this.checked) {
        if (
          _this.userNameReg.test(_this.userNameValue) &&
          _this.passwordReg.test(_this.passwordValue)
        ) {
          if (_this.passwordValue === _this.setPasswordValue) {
            userRegisterMethod(_this)
          } else {
            _this.fromErrPrompt = LoginConstant.DIFFERENT_PASSWORD;
          }
        } else {
          _this.fromErrPrompt = LoginConstant.USERNAME_AND_PASSWORD_FORMAT_ERROR;
        }
      } else {
        _this.$toast(LoginConstant.READ_THE_AGREEMENT);
      }
      break;
    default:
      console.error("router is error");
  }
}

const userLoginMethod = async _this => {
  loading(_this)
  const res = await userLogin(
    _this.userNameValue,
    _this.passwordValue,
  );
  _this.$toast.clear();
  try {
    if (res.status !== 200) {
      _this.fromErrPrompt = res.msg;
      return;
    }
  } catch (e) {
    _this.$toast.fail(LoginConstant.NETWORK_ERROR);
    return;
  }
  localStorage.setItem("token", res.token);
  _this.$toast.success({
    message: LoginConstant.LOGIN_SUCCESSFUL,
    duration: CommonConstant.TOAST_DURATION,
    forbidClick: true,
    onClose() {
      _this.$router.replace("/page/home");
    },
  });
}

const userRegisterMethod = async _this => {
  loading(_this)
  const res = await userRegister(
    _this.userNameValue,
    _this.passwordValue,
  );
  _this.$toast.clear();
  try {
    if (res.status !== 200) {
      _this.fromErrPrompt = res.msg;
      return;
    }
  } catch (e) {
    _this.$toast.fail(LoginConstant.NETWORK_ERROR);
    return;
  }
  _this.$toast.success({
    message: LoginConstant.REGISTER_SUCCESSFULLY,
    duration: CommonConstant.TOAST_DURATION,
    forbidClick: true,
    onClose() {
      _this.$router.push({
        name: "login-input-password",
        params: {
          user: _this.userNameValue,
          routerCheck: _this.checked,
        },
      });
    },
  });
}

// const getUserMessage = async _this => {
//   _this.$store.commit(
//     'savetest',
//     { aaa: 1234567890 }
//   );
// }