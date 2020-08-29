const { mock } = require('mockjs');

// 定义路由规则数据
const defaultRoutes = [
  {
    label: '区服管理',
    children: [
      {
        path: '/zoneManagement/zoneSettings',
        label: '区服设置',
        meta: {
          title: '区服设置'
        }
      }
    ]
  },
  {
    label: '角色管理',
    children: [
      {
        path: '/roleManagement/roleQuery',
        label: '角色查询'
      },
      {
        path: '/roleManagement/chatQuery',
        label: '聊天查询'
      },
      {
        path: '/roleManagement/rucksackQuery',
        label: '背包查询'
      },
      {
        path: '/roleManagement/prosumingQuery',
        label: '产消查询'
      }
    ]
  },
  {

    label: '充值管理',
    children: [
      {
        path: '/rechargeManagement/rechargeDetails',
        label: '充值明细'
      }
    ]
  },
  {
    label: '公告管理',
    children: [
      {
        path: '/announcedManagement/index',
        label: '公告管理'
      }
    ]
  },
  {

    label: '邮件管理',
    children: [
      {
        path: '/mailManagement/index',
        label: '邮件管理'
      }
    ]
  },
  {
    label: '活动管理',
    children: [
      {
        path: '/activityManagement/index',
        label: '活动管理'
      }
    ]
  },
  {

    label: 'CDK管理',
    children: [
      {
        path: '/CDKManagement/index',
        label: 'CDK管理'
      }
    ]
  },
  {
    label: '白名单管理',
    children: [
      {
        path: '/whiteListManagement/index',
        label: '白名单管理'
      },
      {
        path: '/whiteListManagement/whiteListMail',
        label: '白名单邮件'
      }
    ]
  },
  {
    path: '/GMManagement',
    label: 'GM管理'

  }
];
// 定义游戏数据
const defaultGames = [
  {
    id: 1,
    name: '空翼冒险团'
  },
  {
    id: 2,
    name: '刺客契约'
  },
  {
    id: 3,
    name: '无线英雄'
  },
  {
    id: 4,
    name: '上古纷争'
  }
];

// 数据预处理
let data = mock({
  'games': defaultGames,
  'routes': defaultRoutes.filter(() => Math.random() > 0.5),
  'gamename': defaultGames[parseInt(Math.random() * (defaultGames.length))].name
});

// 拦截接口
mock('/api/auth/user/permission', {
  code: 200,
  data
});
