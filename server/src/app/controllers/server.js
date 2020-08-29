import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import statusCode from '../../utils/status-code';
import Ta from '../../utils/requests';

import GmDictService from '../service/gm-dict';
import gmServerService from '../service/gm-server';
import Components from '../service/Components';
@controller('/server')
export class UserController {
	constructor() {}

	@post('/create')
	async createserver(ctx) {
		ctx.log.resourceDesc = '区服创建';
		let form = ctx.request.body;
		let result = await Components.createserver(form);
		ctx.body = statusCode.SUCCESS_200('创建成功', result);
	}
	//区服修改显示状态
	@put('/update')
	async updateserver(ctx) {
		ctx.log.resourceDesc = '区服更改';
		// console.log(ctx.request.body);
		let form = ctx.request.body;
		let result = await Components.updateserver(form);
		ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}
	@put('/allupdate')
	async allupdateserver(ctx) {
		ctx.log.resourceDesc = '区服批量操作';
		let form = ctx.request.body;
		// console.log(form);
		let result = await Components.updateserversnomerge(form.server, form.gameid, form.showstatus, form.merge);
		// let result = await  Ta.operating(form);
		ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}
	@post('/stop')
	async stopserver(ctx){
		ctx.log.resourceDesc = '区服批量操作';
		let data = ctx.request.body;
		let result = await Components.stopserver(data);
		ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}




	//查看所有区服
	@get('/select/all')
	async findall(ctx) {
		ctx.log.resourceDesc = '根据id查找数据';
		let result = await Components.findall(ctx.query);
		ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}


    @get('/selectserver/if')
	async findservers(ctx) {
    	let result = await Components.selectserver(ctx.query);
    	ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}




	/**
	 *  根据游戏ID获取组件
	 * @param {gameid} ctx.query.code  游戏组件键值
	 * @param {gameid} ctx.query.gameid  游戏ID
	 */
	@get('/selectComponent')
    async findComponent(ctx) {
    	ctx.log.resourceDesc = '根据游戏ID 组件名称搜索 区服组件';
    	let query = ctx.query;
    	// console.log(query);
    	let result = await GmDictService.findcomponent(query);
    	ctx.body = statusCode.SUCCESS_200('查找成功', result);
    }
	/**
	 * 查找所有区服
	 * 
	 */

	@get('/selectAllServer')
	async selectAllServer(ctx){
		let result = await gmServerService.findAll();
		ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}
	/**
	 * 
	 * 区服创建
	 */
	@post('/serverCreate')
	async createServer(ctx){
		
		let user = ctx.user;
		let result = await gmServerService.create({...ctx.request.body, createUserId:user.id});
		ctx.body = statusCode.SUCCESS_200('创建成功', result);
	}
	/**
	 * 
	 * 区服按需查找
	 */
	@get('/findServer')
	async findServer(ctx){
		let findForm = ctx.query;
		let result = await gmServerService.serverFindByParam(findForm);
		ctx.body = statusCode.SUCCESS_200('查找', result);
	}
	@get('/findServerByID')
	async findServerByID(ctx){
		ctx.log.resourceDesc = '根据区服ID搜索';
		let findForm = ctx.query;
		let result = await gmServerService.findServerByID(findForm);
		ctx.body = statusCode.SUCCESS_200('查找', result);

	}

	@post('/mergeServer')
	async mergeServer(ctx){
		ctx.log.resourceDesc = '区服合并';
		let serverIDS = ctx.request.body;
		// console.log(serverIDS);
		let result = await gmServerService.mergeServer(serverIDS);
		ctx.body = statusCode.SUCCESS_200('成功', result);
	}
}