<template>
  <div class="user-numerical">
    <van-grid class="grid" :column-num="3" :border="false">
      <van-grid-item v-for="(item, index) in numerical" :key="index">
        <div class="text" slot="text" @click="toUserTypeList(item.type)">
          <div>{{ item.count }}</div>
          <div>
            {{ item.name }}
          </div>
        </div>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {};
  },
  props: {
    numerical: {
      type: Array,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
  },
  methods: {
    toUserTypeList(type) {
      this.$router.push({
        name: "user-type-list",
        query: {
          type,
          userId: this.userId,
          isSelf: true,
        },
      });
    },
  },
};
</script>
<style lang='less' scoped>
.user-numerical {
  .grid {
    box-shadow: 0 2px 15px 5px #ebf4fa;
    .text {
      display: flex;
      align-items: center;
      div:nth-child(1) {
        font-size: 20px;
        color: black;
        font-weight: 600;
      }
      div:nth-child(2) {
        font-size: 10px;
        color: #a9aaac;
        margin-left: 3px;
      }
    }
  }
}
</style>