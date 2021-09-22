import * as Constants from "@/constant/store-constant";

export default {
  [Constants.SAVE_USER_AVATAR](context, payload) {
    context.commit(Constants.SAVE_USER_AVATAR, payload)
  },

}