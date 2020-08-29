<template>
  <div class="layout-box">
    <el-container class="app-container">
      <el-aside class="shrinkTransition" :width="isCollapse ? '200px' : '60px'" style="background-color: rgb(9, 27, 47);">        <appSidebar style="height: 100%;" @shrink="shrink"> </appSidebar>      </el-aside>
      <el-container class="app-body-container">
        <el-header class="app-header-container"  style="height: 100px;"><Navbar></Navbar>         </el-header>
        <el-main>          <AppProject></AppProject>        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// 使用 mock 模拟数据
import '@/utils/mock';

import AppProject from './project/app-project';
import Navbar from './project/navbar';
import appSidebar from './project/app-sidebar';

export default {
  name: 'Layout',
  components: {
    appSidebar,
    AppProject,
    Navbar
  },
  data() {
    return {
      isCollapse: true
    };
  },
  computed: {
    scrollheight() {
      return document.body.scrollHeight;
    },
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      };
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false });
    },
    shrink() {
      this.isCollapse = !this.isCollapse;
    }
  }
};
</script>

<style lang="scss" scoped>
  $backLinear_1:#73a5b0;
  $backLinear_2:#343355;
  $url: '../';
  .business-index{
 
 /* min-height: 869px; */
}
#business-index{
 /* min-height: 869px; */
}
  .layout-box {
    height: 100%;
    width: 100%;
    padding: 0;
    min-width: 1000px;
    background: url($url + "assets/system_images/system-bg-01.jpg");
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .app-container {
    /* padding-left: 5px; */
    height: 100%;
    padding: 0;
  }
  .app-body-container {
    height: 100%;
    min-height: auto;
    background-color: black;
    padding: 0;
  }
.app-header-container{
  height: 200px;
  width: 100%;
  padding: 0;
}
.el-main {
  padding: 0;
  
}

.el-main div{
  min-height: 700px;
}

.el-aside{
  overflow: hidden;
}
.shrinkTransition {
  transition: width 0.5s cubic-bezier(0.075, 1.1, 0.165, 1);
}

</style>
