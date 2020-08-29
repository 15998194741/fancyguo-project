import request from '@/utils/request';


export function getQueryAnnexOptions(params) { 
  return request({
    url: `mail/getQueryAnnexOptions`,
    method: 'get'
  });
}
  

export function getQueryAnnexOptionsLazy(params) { 
  return request({
    url: `mail/getQueryAnnexOptionsLazy`,
    method: 'get',
    params
  });
}


export function getQueryAnnexServernames(params) { 
  return request({
    url: `mail/getQueryAnnexServernames`,
    method: 'get',
    params
  });
}


export function getPlaformChannelToservername(params) { 
  return request({
    url: `mail/getPlaformChannelToservername`,
    method: 'get',
    params
  });
}

export function postMailToCreate(data) { 
  return request({
    url: `mail/postMailToCreate`,
    method: 'post',
    data
  });
}

export function getQueryMail(params) { 
  return request({
    url: `mail/query`,
    method: 'get',
    params
  });
}

export function annexAllQuery(params) { 
  return request({
    url: `mail/annexAllQuery`,
    method: 'get',
    params
  });
}




export function mailSend(data) { 
  return request({
    url: `mail/mailSend`,
    method: 'post',
    data
  });
}


export function mailIdQuery(params) { 
  return request({
    url: `mail/maxID`,
    method: 'get',
    params
  });
}
