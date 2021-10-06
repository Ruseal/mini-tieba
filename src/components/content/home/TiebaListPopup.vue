<template>
  <div class="tieba-list-popup">
    <van-popup
      v-model="isShowTiebaListPopup"
      close-icon-position="top-left"
      close-on-popstate
      position="bottom"
      :style="{ height: '90%' }"
      :overlay-style="{ background: 'rgba(0,0,0,0.7)' }"
      @open="open"
    >
      <van-nav-bar title="选择吧">
        <div slot="left" @click="isShowTiebaListPopup = false">取消</div>
      </van-nav-bar>
      <van-tabs v-model="active" line-height="0px" animated swipeable>
        <van-tab v-for="(item, index) in tabList" :key="index" :title="item">
          <div v-if="!isError" class="scroll">
            <user-label
              @click.native="onUserLabel(item)"
              class="user-label"
              v-for="item in propsTieba[tabsTypeArr[active]]"
              :key="item.id"
              :user-label="{
                title: active === 0 ? item.tiebaName : item.tieba.tiebaName,
                avatar: active === 0 ? item.avatar : item.tieba.avatar,
                level: item.level ? item.level : 1,
              }"
              isLevelCard
            />
          </div>
          <div v-else class="error">网络不稳定,获取列表失败</div>
        </van-tab>
        <div class="tabs-placeholder" slot="nav-right"></div>
      </van-tabs>
    </van-popup>
  </div>
</template>

<script>
import { getRecordList } from "../../../api/user-net";
import { getAllTieba } from "../../../api/tieba-net";
import UserLabel from "../../common/UserLabel.vue";
export default {
  name: "",
  components: { UserLabel },
  data() {
    return {
      isShowTiebaListPopup: false,
      active: 0,
      tabList: ["最近逛的吧", "关注的吧", ""],
      propsTieba: {
        record: [],
        focus: [],
      },
      tabsTypeArr: ["record", "focus"],
      isError: false,
    };
  },
  methods: {
    async open() {
      if (await this.getRecordListMethod()) return;
      await this.getAllTiebaMethod();
    },
    async getRecordListMethod() {
      try {
        const { status, data } = await getRecordList();
        if (status !== 200) throw new Error();
        if (!data.length) return;
        this.propsTieba["record"] = data;
      } catch (error) {
        this.isError = true;
      }
    },
    async getAllTiebaMethod() {
      try {
        const { status, data } = await getAllTieba();
        if (status !== 200) throw new Error();
        this.propsTieba["focus"] = data;
      } catch (error) {
        this.isError = true;
      }
    },
    onUserLabel(tiebaItem) {
      this.$emit("choose", { active: this.active, tiebaItem });
      this.isShowTiebaListPopup = false;
    },
  },
};
</script>
<style lang='less' scoped>
.tieba-list-popup {
  /deep/ .van-tab__text {
    font-size: 13px;
  }
  /deep/ .van-tab--active {
    color: black;
    font-weight: 700;
  }
  .tabs-placeholder {
    width: 100px;
  }
  .scroll {
    width: 100vw;
    height: calc(90vh - 46px - 44px);
    overflow-y: auto;
    padding: 0 12px;
    .user-label {
      margin: 5px 0 20px;
    }
  }
  .error {
    margin: 20px;
    text-align: center;
    font-size: 14px;
    color: rgb(172, 172, 172);
  }
}
</style>