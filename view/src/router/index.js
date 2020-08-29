import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import { addRoutes } from '@/router/rules';
import { getPermission } from '@/api/user';
Vue.use(Router);

/* Layout */
import Layout from '@/layout';

/**
 * 路由
 * @type {*[]}
 */
export const constantRoutes = [
  
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    meta: { title: '登录' },
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'business-index',
        meta: { title: '首页' },
        component: () => import('@/views/business')
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    meta: { title: '404' },
    hidden: true
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/', component: () => import('@/views/2048'), hidden: true }
];

const createRouter = () => new Router({
  mode: 'history',
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
});

const router = createRouter();

let twoAccess = 0;

router.beforeEach(async(to, from, next) => {
  if (from.name === null) { //页面刷新
    if (!store.state.user.permissionInfo.routes.length) {
      // 判断游戏名称记录是否存在
      let currentGameName = sessionStorage.getItem('currentGameName');
      // 发送异步消息
      let { routes } = await getPermissionInfo({ game: currentGameName, username: 'admin' });
      //动态添加路由
      addRoutes(routes, router);
    }
    let pathName = sessionStorage.getItem('pathName'); //暂存上一个路由
    if (pathName === to.path) {
      console.log(111);
      next();
    } else {
      if (twoAccess > 2 && to.path === '/index') {
        return next();
      }
      twoAccess++;
      next(pathName);
    }
  } else {
    next();
  }
});

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

// 请求用户权限信息
async function getPermissionInfo(params) {
  let { code, data } = await getPermission(params);
  // 请求成功时设置权限信息
  if (+code === 200) {
    store.commit('user/SET_PERMISSION_INFO', data);
  }
  return data;
}

export default router;
