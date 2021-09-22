<template>
  <div class="remove-comment-popup">
    <van-popup
      v-model="isShowDeletePopup"
      close-on-popstate
      position="bottom"
      :style="{ height: '10%' }"
      :overlay-style="{ background: 'rgba(0,0,0,0)' }"
      round
    >
      <div class="wrapper">
        <div class="top" @click="deleteComment">
          {{ isShowDelete ? "删除" : "举报" }}
        </div>
        <div class="bottom" @click="isShowDeletePopup = false">取消</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { deleteComment } from "../../../api/detail-net";
import { getUserMessage } from "../../../api/user-net";
import loading from "../../../utils/loading";
import statusHandle from "../../../utils/status-handle";
import { mapState } from "vuex";
export default {
  name: "",
  components: {},
  data() {
    return {
      isShowDeletePopup: false,
      isShowDelete: false,
      commentItem: null,
    };
  },
  computed: {
    ...mapState({
      test: "test",
    }),
  },
  mounted() {
    this.$bus.$on("delete-popup", this.deletePopup);
  },
  destroyed() {
    this.$bus.$off("delete-popup", this.deletePopup);
  },
  methods: {
    async deletePopup(event) {
      this.commentItem = event;
      try {
        const { data, status } = await getUserMessage();
        if (status !== 200) throw new Error();
        if (event.author.id !== data.id) throw new Error();
        this.isShowDelete = true;
      } catch (err) {
        this.isShowDelete = false;
      }
      this.isShowDeletePopup = true;
    },
    async deleteComment() {
      if (this.isShowDelete) {
        let result = null;
        try {
          loading(this);
          const { status } = await deleteComment(this.commentItem.id);
          result = statusHandle(status);
          if (!result.success) throw new Error();
          this.$toast.success("操作成功");
          this.isShowDeletePopup = false;
          if (this.commentItem.toReply) {
            this.$bus.$emit("fresh-reply-popup", this.commentItem.toComment);
          } else {
            this.$emit("delete-fresh-comment", this.commentItem.id);
          }
        } catch (error) {
          this.$toast.fail("网络错误");
          result && this.$toast.fail("登入过期");
        }
      } else {
        this.$toast("暂无举报评论功能");
      }
    },
  },
};
</script>
<style lang='less' scoped>
.remove-comment-popup {
  .wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: rgb(255, 254, 254);
    border-top: 0.5px solid rgba(14, 14, 14, 0.1);
    .top,
    .bottom {
      width: 100%;
      height: 50%;
      text-align: center;
      font-size: 13px;
      line-height: 35px;
    }
  }
}
</style>