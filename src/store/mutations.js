import * as Constants from "@/constant/store-constant";


export default {
  [Constants.SAVE_USER_AVATAR](state, payload) {
    state.userAvatar = payload
  },
  [Constants.SAVE_REPLY_MESSAGE](state, payload) {
    let item = state.replyMsg.find(
      (item) => item.id === payload.id
    );
    if (item) {
      item.message = payload.message
      return
    }
    state.replyMsg.unshift(payload)
  },
  [Constants.SAVE_COMMENT_MESSAGE](state, payload) {
    let item = state.commentMsg.find(
      (item) => item.id === payload.id
    );
    if (item) {
      item.message = payload.message
      item.fileList = payload.fileList
      return
    }
    state.commentMsg.unshift(payload)
  },
  [Constants.SAVE_CURRENT_DETAILID](state, payload) {
    state.currentDetailAuthorId = payload
  },
}