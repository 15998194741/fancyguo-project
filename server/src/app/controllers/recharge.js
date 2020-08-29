import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import statusCode from '../../utils/status-code';
import rechargeService from '../service/recharge';


@controller('/recharge')
export class rechargeController {

    @get('/query')
	async queryCharacter(ctx) {
		ctx.log.resourceDesc = '充值订单查询';
		let data = ctx.query;
		let result = await rechargeService.query(data);
		ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}
    @post('/replenishment')
    async replenishment(ctx) {
    	ctx.log.resourceDesc = '充值订单补单';
    	let data = ctx.request.body;
    	let result = await rechargeService.replenishment(data);
    	try{
    		ctx.body = JSON.parse(result);
    	}catch{
    		ctx.body = {
    			code : 201,
    			msg:'失败'
    		};
    	}
    }



}