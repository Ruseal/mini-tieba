<template>
  <div class="user-star">
    <van-nav-bar :title="$route.query.type">
      <left-arrow slot="left" @click.native="$router.back()" />
      <div slot="right" class="edit" @click="clickEdit">
        {{ isEdit ? "完成" : "编辑" }}
      </div>
    </van-nav-bar>
    <loading v-if="statusData === 'loading'" />
    <error v-else-if="statusData === 'error'" />
    <scroll v-else class="scroll" click>
      <user-star-article
        v-for="item in starList"
        :key="item.id"
        :star-item="item"
        @deleteStar="deleteStar"
        ref="userStarRef"
      />
    </scroll>
  </div>
</template>

<script>
import { getUserStarList } from "@/api/user-net";
import { unstart } from "@/api/detail-net";
import Error from "@/components/common/Error.vue";
import LeftArrow from "@/components/common/LeftArrow.vue";
import Loading from "@/components/common/Loading.vue";
import Scroll from "@/components/common/Scroll.vue";
import UserStarArticle from "@/components/content/user/UserStarArticle.vue";
export default {
  name: "user-star",
  components: { LeftArrow, Scroll, UserStarArticle, Loading, Error },
  data() {
    return {
      statusData: "loading",
      starList: null,
      isEdit: false,
    };
  },
  created() {
    this.getUserStarListMethod();
  },
  methods: {
    async getUserStarListMethod() {
      try {
        const { status, data } = await getUserStarList();
        if (status !== 200) throw new Error();
        this.starList = data;
        this.statusData = "ok";
      } catch (error) {
        this.statusData = "error";
      }
    },
    clickEdit() {
      this.$refs.userStarRef.forEach((ref) => {
        ref.editModel(this.isEdit);
      });

      this.isEdit = !this.isEdit;
    },
    async deleteStar(articleId) {
      try {
        const { status } = await unstart(articleId);
        if (status !== 200) throw new Error();
        this.starList.splice(
          this.starList.indexOf(
            this.starList.find((item) => {
              return item.id === articleId;
            })
          ),
          1
        );
      } catch (err) {
        this.$toast.fail("网络错误");
      }
    },
  },
};
</script>
<style lang='less' scoped>
.user-star {
  /deep/.van-nav-bar__title {
    font-size: 14px;
  }
  .edit {
    color: rgb(48, 82, 231);
  }
  .scroll {
    width: 100vw;
    height: calc(100vh - 46px);
  }
}
</style>