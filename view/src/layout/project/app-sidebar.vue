<template>
  <div class="app-sidebar-container" style="width: 100%;">
    <div style="background-color:#091B2F ;height: 90%;">
      <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
                <el-radio-button :label="false">展开</el-radio-button>
                <el-radio-button :label="true">收起</el-radio-button>
                
      </el-radio-group>-->

      <router-link to="/index">
        <div
          :class="{'app-sidebar-container-logo': true, 'header-flash': isCollapse}"
          style="width: 100%;"
        ></div>
      </router-link>
      <div class="arrow-right-container" @click="shrink">
        <i :class="{'el-icon-d-arrow-right': true, gotoLeft: isCollapse}"></i>
      </div>
      <el-menu
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        background-color="#091B2F"
        text-color="#34C3BB"
        active-text-color="white"
        unique-opened
        router
        :default-active='defaultActive'
        @open="handleOpen"
        @close="handleClose"
      >
        <template v-for="(route, index) in routes">
          <el-submenu
            v-if="route.children && route.children.length"
            :key="index"
            :index="`${index}`"
          >
            <template #title>
              <i class="el-icon-location" />
              <span>{{route.name}}</span>
            </template>
            <el-menu-item
              v-for="({name, url}, _index) in route.children"
              :key="_index"
              :index="`${index}-${_index}`"
              :route="url"
            >{{name}}</el-menu-item>
          </el-submenu>
          <el-menu-item v-else :key="index" :index="`${index}`" :route="route.url">
            <i class="el-icon-location"></i>
            <span slot="title">{{route.name}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </div>
</template>


<script>

export default {
  name: 'AppSidebar',

  data() {
    return {
      isCollapse: false,
      pathName: sessionStorage['pathName'] || ''
      //   styleobj: {
      //     left: '180px'
      //   }
    };
  },
  computed: {
    a: function() {
      return 'superbad';
    },
    defaultActive() {
      let { pathName, routes } = this;
      console.log(routes);
      try {
        routes.forEach(({ children }, index) => {
          children.forEach(({ url }, _index) => {
            if (url === pathName) {
              throw new Error(`${index}-${_index}`);
            }
          });
        });
        return '';
      } catch ({ message }) {
        console.log(message);
        return message;
      }
    },
    routes() {
      return this.$store.state.user.permissionInfo.routes;
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    oneclick() {
      this.$router.push('/district/districtManagement');
    },
    shrink() {
      // 更新信号量
      this.isCollapse = !this.isCollapse;
      //   if (this.styleobj.left === '180px') {
      //     this.styleobj.left = 0;
      //   } else {
      //     this.styleobj.left = '180px';
      //   }

      // 触发自定义事件
      this.$emit('shrink', this.isCollapse);
    },
    logclink() {
      // console.log(1111);
    }
  }
};
</script>

<style lang="scss" scoped>
.app-sidebar-container-logo {
  height: 100px;
  margin-bottom: 10px;
  position: relative;
  left: 0;
  top: 0;
  display: flex;
  /* border: 1px solid #0000ff; */
  height: 100px;
  width: 100%;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: rgb(42, 191, 189);
}

.app-sidebar-container-logo:before {
  content: "";
  position: absolute;
  height: 100%;
  width: 100%;
  background: url(../../styles/images/gsm.png) no-repeat 50% 41%;
  z-index: 10;
  background-size: 80%;
}
.app-sidebar-container-logo.header-flash:before {
  animation: header-flash-before-animation 1s forwards;
}

@keyframes header-flash-before-animation {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}

.app-sidebar-container-logo:after {
  content: "";
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 11;
  background: url(../../styles/images/yxj.png) no-repeat 90% 25%;
  background-size: 30%;
}
.app-sidebar-container-logo.header-flash:after {
  animation: header-flash-after-animation 1s;
  animation-fill-mode: forwards;
}

@keyframes header-flash-after-animation {
  0% {
    background-size: 30%;
  }
  10% {
    background-size: 70%;
  }
  50% {
    transform: rotate(-90deg);
    background-size: 100%;
  }
  100% {
    background-size: 100%;
    transform: rotate(-90deg);
    background-position: 25%;
    background-color: rgb(42, 191, 189);
  }
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
  transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
}

*,
*:before,
*:after {
  box-sizing: initial;
}
.el-menu-vertical-demo {
  transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
}
.el-icon-d-arrow-right {
  transition: all 1s;
  color: white;
  transform: translateX(180px) rotate(180deg);
  font-size: 20px;
  transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  /* animation: myfirst .5s; */
  /* animation-fill-mode: backwards; */
}
/* @keyframes myfirst { */
/* 0%   {left: 180px;} */
/* 100% {left: 0px;} */
/* } */
/* @keyframes mydemo {
    0%   {left: 0;}
    100% {left: 180px;}
} */
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

.el-icon-d-arrow-right {
  /* transition: left 0.5s cubic-bezier(0.075, 1.1, 0.165, 1); */
}
/* .el-icon-d-arrow-right:active{
    left: 0;
} */

#superbad {
  transition: left 0.5s cubic-bezier(0.075, 1.1, 0.165, 1);
}
/* #superbad:active{
    left: 0;
} */
#supergood {
  transition: left 0.5s cubic-bezier(0.075, 1.1, 0.165, 1);
}

/* #supergood:active{
    left: 180;
} */

.gotoLeft {
  transform: translateX(0);
}
.arrow-right-container {
  cursor: pointer;
  &:hover {
    background: rgba(7, 22, 38, 1);
  }
}
</style>

