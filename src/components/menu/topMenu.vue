<!-- src/menu/topMenu.vue -->
<template>
  <div id="top-menu">
    <img class="logo" :src="logoPath" />
    <p class="name">{{ name }}</p>
  </div>
</template>
<script>
export default {
  name: 'topMenu',
  props: ['logoPath', 'name']
}
</script>
<style lang="less" scoped>
#top-menu {
  text-align: left;
  background-color: #fff;
  // padding: 20px 20px 20px 20px;
  .logo {
    width: 150px;
    margin-left: 20px;
    float: left;
  }
  .name {
    display: inline-block;
    line-height: 52px;
    color: #000;
    font-size: 30px;
    margin-left: -80px;
  }
}
</style>