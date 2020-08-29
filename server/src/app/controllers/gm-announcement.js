import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import gmAnnouncementService from '../service/gm-announcement';
import statusCode from '../../utils/status-code';
import fs from 'fs';

@controller('/announcement')
export class GmAnnouncementController {
	@post('/create')
	  async create(ctx) {
		  let data = ctx.request.body;
		  let file = ctx.request.files;
		  let result;
		  let {id} = ctx.user;
		  switch (data.type){
			  case '2': result = await gmAnnouncementService.createBulletin(data, file, id);break;
			  case '1': result = await gmAnnouncementService.createMarquee(data, id);break;
		  }
		  let {CpMsg} = result;
		if(!CpMsg){
			ctx.body = statusCode.SUCCESS_200('新增成功', result);
		}else{
			ctx.body = {
				code:201,
				msg:CpMsg
			};
		}
	  	
	  }
	  @get('/query')
	  async query(ctx) {
		let data = ctx.query;
		let result = await gmAnnouncementService.queryBulletin(data);
	  	ctx.body = statusCode.SUCCESS_200('查找成功', result);
	  }
	  @put('/update')
	  async update(ctx) {
	  	let data = ctx.query;
	  	let result = await gmAnnouncementService.updateBulletin(data);
	  	ctx.body = statusCode.SUCCESS_200('修改成功', result);
	  }

	  @post('/send')
	  async send(ctx) {
	  	let data = ctx.request.body;
	  	let result = await gmAnnouncementService.sendBulletin(data);
	  	ctx.body = statusCode.SUCCESS_200('发送成功', result);
	  }
	  @get('/weights')
	  async weights(ctx) {
	  	let data = ctx.query;
	  	let result = await gmAnnouncementService.queryweights(data);
	  	ctx.body = statusCode.SUCCESS_200('查找成功', result);
	  }
	  @get('/queryservernames')
	  async queryservernames(ctx) {
	  	let data = ctx.query;
	  	let result = await gmAnnouncementService.queryservernames(data);
	  	ctx.body = statusCode.SUCCESS_200('查找成功', result);
	  }

	  

	  @put('/putchangeoneannounced')
	  async putchangeoneannounced(ctx) {
	  	let data = ctx.request.body;
	  	let result = await gmAnnouncementService.putchangeoneannounced(data);
	  	ctx.body = statusCode.SUCCESS_200('修改成功', result);
	  }













//   @get('/findAll')
// 	async findAll(ctx) {
// 		ctx.log.resourceDesc = '查找全部数据';
// 		const result = await gmAnnouncementService.findAll();
// 		ctx.body = statusCode.SUCCESS_200('查找成功', result);
// 	}
//   @get('/findById/:id')
//   async findById(ctx) {
//   	ctx.log.resourceDesc = '根据id查找数据';
//   	const result = await gmAnnouncementService.findById(ctx.params.id);
//   	ctx.body = statusCode.SUCCESS_200('查找成功', result);
//   }
//   @post('/')
//   async create(ctx) {
//   	ctx.log.resourceDesc = '新增数据';
//   	if(!ctx.user) throw statusCode.ERROR_501('用户未登录');
//   	const result = await gmAnnouncementService.create(ctx.request.body);
//   	ctx.body = statusCode.SUCCESS_200('新增成功', result);
//   }
//   @put('/')
//   async update(ctx) {
//   	ctx.log.resourceDesc = '修改数据';
//   	if(!ctx.user) throw statusCode.ERROR_501('用户未登录');
//   	const result = await gmAnnouncementService.updateById(ctx.request.body);
//   	ctx.body = statusCode.SUCCESS_200('修改成功', result);
//   }
//   @del('/')
//   async delete(ctx) {
//   	ctx.log.resourceDesc = '逻辑删除数据';
//   	if(!ctx.user) throw statusCode.ERROR_501('用户未登录');
//   	const result = await gmAnnouncementService.logicDeleteByIdToUserId(ctx.request.body.id, ctx.user);
//   	ctx.body = statusCode.SUCCESS_200('删除成功', result);
//   }
}
