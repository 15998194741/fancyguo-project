<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// 引入 js-cookie 库
import Cookies from 'js-cookie';
export default {
  name: 'App',
  created() {
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('pathName', window.location.pathname); //重点：暂存页面刷新的地址
    });
    // 获取参数集合
    const params = new URLSearchParams(location.search);
    // 判断参数集合中是否存在 token 字段，存在则直接存到 cookie 里
    if (params.has('token')) { Cookies.set('fancy-work-plan-token', params.get('token')); }
    // console.log(this);
    this.$store.dispatch('user/setusers');
  }
};
</script>

<style lang="scss">
  #app {
    /*
   background-size: 100% 100%;
   background-repeat: no-repeat;
   background-attachment: fixed;
   background: url("assets/system_images/system-bg-01.jpg");
   */
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .el-scrollbar__view {
    height: 100%;
  }
  .el-select-dropdown__list {
    padding: 6px 0 10px;
  }
  .el-scrollbar__bar{
    &.is-vertical{
      width: 8px;//滚动条宽度
    }
  }
  .el-scrollbar__thumb {
    background-color: rgba(42, 58, 68, 0.51);
  }
  .el-scrollbar__thumb:hover {
    background-color: rgba(43, 76, 142, 0.68);
  }
  .mce-branding .mce-widget .mce-label .mce-flow-layout-item .mce-last {
    display: none;
  }
</style>
