import request from '@/utils/request';

let headers = {
  'Content-Type': 'multipart/form-data'
};
export function postcreateAnnouncement(data) { 
  return request({
    url: `announcement/create`,
    method: 'POST',
    data,
    headers
  });
}


export function getqueryAnnouncement(params) { 
  return request({
    url: `announcement/query`,
    method: 'GET',
    params
    
  });
}
export function putupdateAnnouncement(params) { 
  return request({
    url: `announcement/update`,
    method: 'PUT',
    params
    
  });
}

export function postsendAnnouncement(data) { 
  return request({
    url: `announcement/send`,
    method: 'POST',
    data
  });
}



export function getqueryMarqueeweights(params) { 
  return request({
    url: `announcement/weights`,
    method: 'GET',
    params
    
  });
}




export function getqueryservernames(params) { 
  return request({
    url: `announcement/queryservernames`,
    method: 'GET',
    params
    
  });
}



export function putchangeoneannouncedreq(data) { 
  return request({
    url: `announcement/putchangeoneannounced`,
    method: 'PUT',
    data
    
  });
}
