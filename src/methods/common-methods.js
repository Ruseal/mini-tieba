import { isLogin } from '@/api/user-net'

export const isLoginMethod = async (_this) => {
  try {
    const { status } = await isLogin()
    if(status===401) {
      _this.$toast.fail('您还未登入哦')
      return
    }
    if(status!==200) throw new Error()
    return true
  } catch (err) {
    _this.$toast.fail('网络不稳定，请稍后再尝试')
  }
}