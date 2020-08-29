import request from '@/utils/request';


export function rechargeQuery(params) { 
  return request({
    url: `recharge/query`,
    method: 'get',
    params
  });
}


export function replenishmentpost(data) { 
  return request({
    url: `recharge/replenishment`,
    method: 'post',
    data
  });
}
