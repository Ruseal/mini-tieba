<template>
  <div class="user-Type-list">
    <van-nav-bar :title="'全部'+title">
      <left-arrow slot="left" @click.native="$router.back()" />
    </van-nav-bar>
    <loading v-if="statusData === 'loading'" />
    <error v-else-if="statusData === 'error'" />
    <div v-else>
      <div class="top-text">
        {{ "共" + countType + typeList.length + "个" + typeName }}
      </div>
      <scroll class="scrroll" click>
        <user-label
          class="user-label"
          v-for="item in typeList"
          :key="item.id"
          :userLabel="{
            authId:item.id,
            title: item.name,
            avatar: item.avatar,
            introduction: item.indt,
            isFocus:item.isfocus,
          }"
          :labelType="['article']"
          labelRight="focus"
        />
      </scroll>
    </div>
  </div>
</template>

<script>
import { getUserDetailList } from "../../../api/user-net";
import Error from "../../../components/common/Error.vue";

import LeftArrow from "../../../components/common/LeftArrow.vue";
import Loading from "../../../components/common/Loading.vue";
import Scroll from "../../../components/common/Scroll.vue";
import UserLabel from "../../../components/common/UserLabel.vue";
export default {
  name: "user-type-list",
  components: { LeftArrow, Scroll, UserLabel, Loading, Error },
  data() {
    return {
      statusData: "loading",
      typeList: null,
      title: "",
      countType: "",
      typeName: "",
    };
  },
  created() {
    this.typeHandle();
    this.getUserDetailListMethod();
  },

  methods: {
    typeHandle() {
      switch (this.$route.query.type) {
        case "focus":
          this.title = "关注";
          this.countType = "关注";
          this.typeName = "吧友";
          break;
        case "fans":
          this.title = "粉丝";
          this.countType = "拥有";
          this.typeName = "粉丝";
          break;
        case "tieba":
          this.title = "贴吧";
          this.countType = "加入";
          this.typeName = "贴吧";
          break;
        default:
      }
    },
    async getUserDetailListMethod() {
      try {
        const { status, data } = await getUserDetailList(
          this.$route.query.userId
        );
        if (status !== 200) throw new Error();
        this.statusData = "ok";
        this.typeList = data[this.$route.query.type];
      } catch (error) {
        this.statusData = "error";
      }
    },
  },
};
</script>
<style lang='less' scoped>
.user-Type-list {
  .top-text {
    height: 20px;
    font-size: 12px;
    color: rgb(131, 131, 131);
    margin-left: 15px;
  }
  .scroll {
    padding: 5px 10px;
    width: 100vw;
    height: calc(100vh - 46px - 20px);
    // background-color: rgb(197, 184, 184);
    .user-label {
      margin: 15px 0;
    }
  }
}
</style>