import router from '../router/index'

export default (status) => {
  let result = {
    success: true,
  };
  switch (status) {
    case 200:
      break;
    case 401:
      router.replace({ name: "login-user" });
      result.success = false;
      result.message = "登入已过期";
      break;
    default:
      result.success = false;
  }
  return result;

}