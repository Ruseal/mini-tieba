import { articleLike, articleUnLike } from '@/api/home-net'
import { unFocusUser, focusUser } from "@/api/user-net";
import { focusTieba } from '@/api/tieba-net'
import statusHandle from '@/utils/status-handle'
export default {
  data() {
    return {
    }
  },
  methods: {
    async articleLike() {
      let result = null
      try {
        const { status } = await articleLike(this.articleItem.id);
        result = statusHandle(status)
        if (!result.success) throw new Error()
      } catch (err) {
        this.$toast.fail('网络错误')
        result && this.$toast.fail('登入已过期')
        return true
      }
    },
    async articleUnLike() {
      let result = null
      try {
        const { status } = await articleUnLike(this.articleItem.id);
        result = statusHandle(status)
        if (!result.success) throw new Error()
      } catch (err) {
        this.$toast.fail('网络错误')
        result && this.$toast.fail('登入已过期')
        return true
      }
    },
    async articleLikeHandle(event) {
      if (this.articleItem.isLike) {
        if (await this.articleUnLike()) return;
        this.$bus.$emit(event, {
          id: this.articleItem.id,
          isLike: false,
          count: -1,
        });
        this.articleItem.isLike = false;
        this.articleItem.likeCount--;
      } else {
        if (await this.articleLike()) return;
        this.$bus.$emit(event, {
          id: this.articleItem.id,
          isLike: true,
          count: 1,
        });
        this.articleItem.isLike = true;
        this.articleItem.likeCount++;
      }
    },
    syncHandle(event) {
      if (this.articleItem.id !== event.id) return;
      this.articleItem.isLike = event.isLike;
      this.articleItem.likeCount += event.count;
    },
    async focusTiebaMethod() {
      let result = null;
      try {
        const { status } = await focusTieba(this.tiebaMsg.id);
        result = statusHandle(status);
        if (!result.success) throw new Error(result.message);
        this.tiebaMsg.cardMsg.isFocus = true;
        this.tiebaMsg.focusCount += 1;
        this.$toast("已关注");
      } catch (err) {
        this.$toast.fail("关注失败");
        result.message && this.$toast.fail(result.message);
      }
    },

    async unFocusUserMethod(userId) {
      try {
        const { status } = await unFocusUser(userId);
        if (status !== 200) throw new Error();
        return true;
      } catch (err) {
        this.$toast.fail("操作失败");
        return false;
      }
    },

    async focusUserMethod(userId) {
      try {
        const { status } = await focusUser(userId);
        if (status === 401) {
          this.$toast.fail('用户未登入')
          return
        }
        if (status !== 200) throw new Error();
        return true;
      } catch (err) {
        this.$toast.fail("操作失败");
        return false;
      }
    },

    searchCellRouter() {
      if (this.cellType === 'tieba') {
        this.$router.push({
          name: "tieba",
          query: {
            tid: this.dataList.id,
          },
        });
        return
      }
      if (this.cellType === 'user') {
        this.$router.push({
          name: "user-detail",
          params: {
            userId: this.dataList.id,
          },
        });
      }
    }
  }
}