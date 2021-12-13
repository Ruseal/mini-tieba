<template>
 <div class='tieba-error'>
   <img src="@/assets/img/come/yw.jpg" alt="">
   <p>找不到贴吧(-1)</p>
   <div class="to-login" @click="$router.replace({name:'login-user'})">戳这去登入</div>
 </div>
</template>

<script>
export default {
  name: '',
  components: {},
  data () {
    return {
      
    };
  },
}
</script>
<style lang='less' scoped>
.tieba-error{
  width: 100%;
  height: 100%;
  img{
    width: 80px;
    height: 80px;
    margin-left: 50%;
    margin-top: 50%;
    transform: translate(-50%,-50%);
  }
  p{
    font-size: 10px;
    text-align: center;
    margin-top: -30px;
  }
  .to-login{
    width: 120px;
    padding: 0 20px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 13px;
    border-radius: 15px;
    margin: 20px auto;
    color: white;
    background-color: rgb(93, 109, 250);
  }
}
</style>