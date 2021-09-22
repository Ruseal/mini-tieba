<template>
  <div class="detail-content">
    <div><slot name="user-label"></slot></div>
    <h2 class="detail-title">{{ contentData.title }}</h2>
    <p class="detail-text">
      {{ contentData.text }}
    </p>
    <div class="img-wrapper">
      <img
        v-for="(img, index) in contentData.imageList"
        v-lazy="img"
        :key="index"
        @load="imageLoad"
        class="detail-img"
        alt=""
      />
    </div>
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
    contentData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    imageLoad() {
      this.$emit("image-load");
    },
  },
};
</script>
<style lang='less' scoped>
.detail-content {
  width: 100%;
  padding: 15px 10px 0;
  background-color: #fff;
  .detail-title {
    padding: 18px 0 10px;
  }
  .img-wrapper {
    .detail-img {
      width: 100%;
      max-height: 600px;
      border-radius: 5px;
      object-fit: cover;
      object-position: top;
      margin-top: 7px;
    }
  }
}
</style>