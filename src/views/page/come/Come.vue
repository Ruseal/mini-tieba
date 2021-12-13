<template>
  <div class="come">
    <come-search />
    <van-tabs
      class="tabs"
      v-model="active"
      line-width="0.5rem"
      title-active-color="black"
      ref="tabsRef"
    >
      <van-tab
        v-for="(item, index) in ['我的吧', '', '', '', '']"
        :title="item"
        :key="index"
      >
        <loading v-if="statusData === 'loading'" />
        <error v-if="statusData === 'error'" />
        <tieba-error v-if="statusData === 'not-auth'" />
        <scroll v-else class="scroll" click ref="scrollRef">
          <card-list ref="cardListRef">
            <card-list-item
              @fresh-scroll="freshColScroll"
              @click.native="toTieba(item.id)"
              class="card-list-item"
              :tieba-card-item="item"
              v-for="item in recordList"
              :key="item.id"
            />
          </card-list>
          <square @click.native="$router.replace({ name: 'channel' })" />
          <div class="come-tabs">
            <div>关注的吧</div>
            <div @click="$toast('暂只支持等级排序')">等级排序</div>
          </div>
          <user-label
            @click.native="toTieba(item.id)"
            class="user-label"
            v-for="(item, index) in allTiebaList"
            :key="index"
            :labelType="['article']"
            :userLabel="{
              avatar: item.tieba.avatar,
              title: item.tieba.tiebaName,
              level: item.level,
              introduction: item.tieba.introduction
                ? item.tieba.introduction
                : '暂无简介',
              isTieba: true,
            }"
            isLevelCard
          />
          <interest />
        </scroll>
      </van-tab>
      <div class="tabs-placeholder" slot="nav-right">
        <img src="@/assets/img/come/sign.png" alt="" />
      </div>
    </van-tabs>
  </div>
</template>

<script>
import { getAllTieba } from "@/api/tieba-net";
import { getRecordList } from "@/api/user-net";
import debounce from "@/utils/debounce";
import Error from "@/components/common/Error.vue";
import Loading from "@/components/common/Loading.vue";
import Scroll from "@/components/common/Scroll.vue";
import UserLabel from "@/components/common/UserLabel.vue";
import CardList from "@/components/content/come/CardList.vue";
import CardListItem from "@/components/content/come/CardListItem.vue";
import ComeSearch from "@/components/content/come/ComeSearch.vue";
import Interest from "@/components/content/come/Interest.vue";
import Square from "@/components/content/come/Square.vue";
import TiebaError from "@/components/content/come/TiebaError.vue";
export default {
  name: "come",
  components: {
    ComeSearch,
    Scroll,
    CardList,
    CardListItem,
    Square,
    UserLabel,
    Interest,
    TiebaError,
    Loading,
    Error,
  },
  data() {
    return {
      active: 0,
      statusData: "loading",
      allTiebaList: [],
      recordList: [
        {
          id: -1,
          avatar: require("../../../assets/img/come/tieba_xz.jpeg"),
          tiebaName: "寻找贴吧",
          notData: true,
        },
      ],
      freshScroll: null,
      controlUpdata: 0,
    };
  },
  created() {
    this.getAllTiebaMethod();
  },
  activated() {
    this.getRecordListMethod();
  },
  mounted() {
    this.$nextTick(() => {
      this.freshScroll = debounce(
        this.$refs.cardListRef[0].colScrollRef.refresh,
        100
      );
    });
  },
  methods: {
    async getAllTiebaMethod() {
      try {
        const { status, data } = await getAllTieba();
        if (status === 401) {
          this.statusData = "not-auth";
          return;
        }
        if (status !== 200) throw new Error();
        this.statusData = "ok";
        data.sort((obj1, obj2) => {
          return obj2.level - obj1.level;
        });
        this.allTiebaList = data;

        this.$nextTick(() => {
          this.$refs.scrollRef[0].refresh();
        });
        this.getRecordListMethod();
      } catch (err) {
        this.statusData = "error";
        this, $toast.fail("网络错误");
      }
    },
    async getRecordListMethod() {
      try {
        const { status, data } = await getRecordList();
        if (status === 401) {
          this.statusData = "not-auth";
          return;
        }
        if (status !== 200) throw new Error();
        if (!data.length) return;
        this.recordList = data;
      } catch (err) {
        this.$toast.fail("网络不稳定，获取访问贴吧记录失败");
      }
    },
    toTieba(tiebaId) {
      if (tiebaId === -1) {
        this.$router.replace({ name: "channel" });
        return;
      }
      this.$router.push({
        name: "tieba",
        query: {
          tid: tiebaId,
        },
      });
    },
    freshColScroll() {
      this.freshScroll();
    },
  },
};
</script>
<style lang='less' scoped>
.come {
  padding-bottom: 50px;
  .tabs {
    /deep/ .van-tabs__line {
      bottom: 18px;
      background-color: rgb(84, 95, 245);
    }
    /deep/ .van-tab--active {
      font-weight: 700;
    }
    .tabs-placeholder {
      width: 80px;
      img {
        width: 23px;
        height: 23px;
        margin-top: 12%;
        margin-left: 55%;
      }
    }
    .scroll {
      width: 100%;
      height: calc(100vh - 44px - 44px - 50px);
      padding: 0 10px;
      white-space: nowrap;
      .card-list-item:last-child {
        margin-right: 10px;
      }
      .come-tabs {
        display: flex;
        justify-content: space-between;
        margin-top: 30px;
        div:first-child {
          font-size: 15px;
          font-weight: 600;
        }
        div:last-child {
          font-size: 13px;
        }
      }
      .aaa {
        padding: 10px 0;
        height: 30px;
        background-color: rgb(109, 156, 123);
      }
      /deep/.user-label {
        height: 45px;
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
  }
}
</style>