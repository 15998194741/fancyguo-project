const getters = {
  // 系统样式
  sidebar: state => state.app.sidebar,
  // 用户信息
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickName: state => state.user.nickName,
  username: state => state.user.username,
  userId: state => state.user.id,
  isNativeUser: state => state.user.isNativeUser,
  permissionInfo: state => state.user.permissionInfo,
  user: state => state.user,
  gameid: state => state.user.permissionInfo.gameid
};
export default getters;
