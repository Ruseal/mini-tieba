<template>
  <div id="app">
    <keep-alive
      exclude="detail,tieba,come,tieba-msg,user-type-list,user-edit,user-star,user-history,search,create-tieba,notice-Reply,notice"
    >
      <router-view />
    </keep-alive>
  </div>
</template>

<style lang="less">
@import "~assets/css/base.css";
</style>
