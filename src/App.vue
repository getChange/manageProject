<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {

}
</script>

<style type="text/css">
/*
	找到html标签、body标签，和挂载的标签
	都给他们统一设置样式
*/
html,
body,
#app,
.el-container {
  /*设置内部填充为0，几个布局元素之间没有间距*/
  padding: 0px;
  /*外部间距也是如此设置*/
  margin: 0px;
  /*统一设置高度为100%*/
  height: 100%;
}
</style>

<style lang="less" scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif "Microsoft YaHei";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
