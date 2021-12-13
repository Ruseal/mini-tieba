<template>
  <div class="search-type">
    <div class="title">
      <div class="name">{{ showDelete ? "搜索历史" : "搜索发现" }}</div>
      <img
        @click="$emit('delete')"
        v-if="showDelete"
        src="@/assets/img/common/delete.png"
        alt=""
      />
    </div>
    <div class="container">
      <div
        class="history-item"
        @click="searchTypeClick(item.name)"
        v-for="item in currentList"
        :key="item.name"
      >
        {{ item.name }}
      </div>
      <div v-if="isShowLast" class="last-history-item" @click="showMoreHistory">
        <img
          :class="{ 'img-rotate': isShowMore }"
          src="../../../assets/img/common/arrow.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      isShowLast: false,
      sliceList: [],
      isShowMore: false,
      currentList: [],
    };
  },
  props: {
    historyList: {
      type: Array,
      required: true,
    },
    showDelete: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  created() {
    this.isShowLast = this.historyList.length > 10;
    if (this.isShowLast) {
      this.sliceList = this.historyList.slice(0, 10);
      this.currentList = this.sliceList;
      return;
    }
    this.currentList = this.historyList;
  },
  methods: {
    showMoreHistory() {
      if (!this.isShowMore) {
        this.currentList = this.historyList;
      } else {
        this.currentList = this.sliceList;
      }
      this.isShowMore = !this.isShowMore;
    },
    searchTypeClick(name) {
      this.$bus.$emit("change-value", name);
    },
  },
};
</script>
<style lang='less' scoped>
.search-type {
  position: relative;
  float: left;
  width: 95vw;
  border-radius: 15px;
  margin-left: 50%;
  transform: translateX(-50%);
  padding: 10px;
  background-color: #fff;
  margin-bottom: 10px;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .name {
      font-weight: 600;
      font-size: 14px;
    }
    img {
      width: 16px;
      height: 18px;
    }
  }
  .container {
    padding-top: 8px;
    height: 100%;
    .history-item {
      max-width: 105px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      float: left;
      margin: 10px 10px 0 0;
      font-size: 12px;
      background-color: rgb(239, 243, 243);
      padding: 6px 10px;
      border-radius: 15px;
    }
    .last-history-item {
      float: left;
      width: 28px;
      height: 28px;
      margin: 10px 10px 0 0;
      padding: 8px 7px 6px 7px;
      border-radius: 14px;
      background-color: rgb(239, 243, 243);
      img {
        width: 100%;
        height: 100%;
      }
      .img-rotate {
        transform: rotate(180deg);
      }
    }
  }
  .load-more {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: rgb(139, 107, 107);
  }
}
</style>