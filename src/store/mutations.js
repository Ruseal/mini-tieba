import * as Constants from "@/constant/store-constant";


export default {
  [Constants.SAVE_USER_AVATAR](state, payload) {
    state.userAvatar = payload
  }
}