<template>
  <div id="app">
    <keep-alive exclude="detail,tieba,come">
      <router-view />
    </keep-alive>
  </div>
</template>

<style lang="less">
@import "~assets/css/base.css";
</style>
