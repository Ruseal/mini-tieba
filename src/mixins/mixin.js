import { articleLike, articleUnLike } from '@/api/home-net'
import { focusTieba } from '../api/tieba-net'
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
      } catch (error) {
        this.$toast.fail("关注失败");
        result.message && this.$toast.fail(result.message);
      }
    },
  }
}