import * as CommonConstant from '@/constant/commom-constant'
import * as LoginConstant from '@/constant/login-constant'

export default (vmComponent) => {
  let netWork = true;
  vmComponent.$toast.loading({
    duration: 0,
    loadingType: "spinner",
    forbidClick: true,
    message: "加载中",
    onClose() {
      netWork = false;
    },
  });
  setTimeout(() => {
    if (netWork) {
      //超时处理
      vmComponent.$toast.clear();
      vmComponent.$toast.fail(LoginConstant.NETWORK_ERROR);
    }
  }, CommonConstant.LOADING_NETWORK_TIMEOUT_TIME);
}