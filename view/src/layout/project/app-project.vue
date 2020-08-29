<template>
  <el-container class="app-project">
    <el-main>
      <transition name="fade-transform" mode="out-in">
        <!-- <router-view :style="{ minHeight: fullHeight }"/> -->
        <router-view ></router-view>
      </transition>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'AppProject',
  components: {
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    sidebarOpend() {
      return this.sidebar.opened;
    },
    routeName() {
      return this.$route.name;
    },
    asideWidth() {
      if (this.sidebarOpend) {
        return '250px';
      }
      return '50px';
    },
    fullHeight() {
      return (document.documentElement.clientHeight - 100) + 'px';
    },
    isWhite() {
      return this.routeName === 'version-task-report' || this.routeName === 'task-global-search';
    }
  },
  // watch: {
  // routeName: function(val) {
  //   this.handleComName(val);
  // }
  // },
  mounted() {
    // this.handleComName(this.routeName);
  },
  methods: {
    onShowSidebar() {
      if (this.sidebarOpend) {
        this.$store.dispatch('app/closeSideBar');
      } else {
        this.$store.dispatch('app/openSideBar');
      }
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  $sideBarBackColor:#2e3139;
  $sidebarHeadLinear_1:#dfdfdf;
  $sidebarHeadLinear_2:#ececec;
  $borderLinear_1:#77bfb4;
  $borderLinear_2:#68a79f;
  .app-project{
    height: 100%;
  }
  flex-row{
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .el-aside {
    transition: width 1s ease-out;
    border-radius: 10px 0 0 0;
    overflow: hidden;
    background: #2e3139;
    .show-unfold-conceal-btn {
      position: absolute;
      background: #2e3139;
      width: 30px;
      color: white;
      height: 30px;
      left: 255px;
      top: 126px;
      border-radius: 0 15px 15px 0;
      box-shadow: 3px 2px 3px -1px #bbbbbb;
      cursor: pointer;
      line-height: 30px;
      /* padding-left: 3px; */
      display: none;
      transition: left 1s ease-out;
      z-index: 999;
      .pull-down-up {
        transition: transform 1s ease-out;
      }
      &.rotate-90 {
        left: 255px;
        .pull-down-up {
          transform: rotate(90deg);
        }
      }
      &.rotate-270 {
        left: 55px;
        .pull-down-up {
          transform: rotate(270deg);
        }
      }
    }
    &:hover {
      .show-unfold-conceal-btn {
        display: block;
      }
    }
    
  }

  .white-background {
    background-color: #ededed;
  }
  .el-main {
    /* border-radius: 0 10px 0 0; */
    padding: 0;
    background-color: #ededed;
    /* margin-right: 5px; */
    /*overflow-x: hidden;*/
  }

</style>

