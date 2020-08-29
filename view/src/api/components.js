
import request from '@/utils/request';

//获取每一个组件得值
export function findComponents(params) { 
  return request({
    url: `server/selectComponent`,
    method: 'get',
    params
  })
  ;
}
  



export function serverselect(data) {
  return request({
    url: 'server/selectserver/if',
    method: 'get',
    params: data
  });
}



//服务器创建
export function servercreate(data) {
  return request({
    url: 'server/serverCreate',
    method: 'post',
    data
  });
}

//服务器修改
export function serverUpdateToOne(data) {
  return request({
    url: 'server/update',
    method: 'put',
    data
  });
}


//服务器批量修改
export function serverallupdate(data) {
  return request({
    url: 'server/allupdate',
    method: 'put',
    data
  });
}


export function toeknsetuser() {
  return request({
    url: 'user/token',
    method: 'get'
  });
}


export function getpage(params) {
  return request({
    url: 'server/select/all',
    method: 'get',
    params
  });
}




export function gameid(gamename) {
  return request({
    url: 'server/gameid',
    method: 'get',
    params: gamename
  });
}

export function stopserver(gamename) {
  return request({
    url: 'server/stop',
    method: 'post',
    data: gamename
  });
}


//区服查找
export function findServer(params) {
  return request({
    url: 'server/findServer',
    method: 'get',
    params 
  });
}



export function findServerByID(params) {
  return request({
    url: 'server/findServerByID',
    method: 'get',
    params 
  });
}





export function ServerMerge(data) {
  return request({
    url: 'server/mergeServer',
    method: 'post',
    data 
  });
}
