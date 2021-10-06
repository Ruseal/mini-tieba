<template>
  <div class="interest">
    <div class="interest-tabs">
      <div class="title">可能感兴趣的吧</div>
      <left-arrow class="arrow" />
    </div>
    <div class="list">
      <div class="item">
        <img src="../../../assets/img/come/app_utils.png" alt="" />
        <div class="aquare">吧广场</div>
        <div class="label">找优质好吧</div>
      </div>
    </div>
    <div class="create" @click="createTieba">
      <img src="../../../assets/img/come/create.png" alt="" />
      <div>创建自己的吧</div>
    </div>
  </div>
</template>

<script>
import LeftArrow from "../../common/LeftArrow.vue";
export default {
  name: "",
  components: { LeftArrow },
  data() {
    return {};
  },
  methods:{
    createTieba(){
      this.$router.push({
        name:'create-tieba'
      })
    }
  }
};
</script>
<style lang='less' scoped>
.interest {
  padding-bottom: 40px;
  .interest-tabs {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    .title {
      font-size: 15px;
      font-weight: 600;
    }
    .arrow {
      position: absolute;
      width: 9px;
      height: 9px;
      transform: rotate(135deg);
      right: 20px;
    }
  }
  .list {
    width: 100%;
    height: 100px;
    margin-top: 10px;
    .item {
      width: 70px;
      height: 100%;

      img {
        width: 68px;
        height: 60px;
        margin-left: 50%;
        transform: translateX(-50%);
      }
      .aquare {
        font-size: 14px;
        text-align: center;
      }
      .label {
        font-size: 11px;
        color: rgb(150, 148, 148);
        text-align: center;
      }
    }
  }
  .create {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
    height: 30px;
    border-radius: 15px;
    border: 1px solid rgb(177, 177, 177);
    margin: 0 auto;
    margin-top: 30px;
    margin-bottom: 80px;
    img {
      margin-top: 3px;
      width: 15px;
      height: 15px;
    }
    div {
      margin-left: 5px;
      font-size: 12px;
      text-align: center;
    }
  }
}
</style>