import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import statusCode from '../../utils/status-code';
import CDKService from '../service/cdk';
const path = require('path');
const fs = require('fs');
const sendflie = require('koa-sendfile');

@controller('/cdk')
export class CDKController {
    @post('/createcdk')
	async createcdk(ctx) {
		ctx.log.resourceDesc = 'CDK创建';
		let data = ctx.request.body;
		let result = await CDKService.createcdk(data);
		ctx.body = statusCode.SUCCESS_200('创建成功', result);
	}
	@get('/test')
    async test(ctx) {
    	ctx.log.resourceDesc = 'CDK创建';
    	let data = ctx.query;
    	let result = await CDKService.test(data);
    	ctx.body = statusCode.SUCCESS_200('创建成功', result);
    }
	@get('/cdkConvert')
	async cdkConvert(ctx) {
    	ctx.log.resourceDesc = 'CDK兑换';
    	let data = ctx.query;
    	let result = await CDKService.cdkConvert(data);
    	ctx.body = statusCode.SUCCESS_200('创建成功', result);
	}
	@get('/cdkCreateSchedule')
	async cdkCreateSchedule(ctx) {
    	ctx.log.resourceDesc = 'CDK创建进度查询';
    	let data = ctx.query;
    	let result = await CDKService.cdkCreateSchedule(data);
    	ctx.body = statusCode.SUCCESS_200('创建成功', result);
	}
	@get('/cdkFind')
	async cdkFind(ctx) {
    	ctx.log.resourceDesc = 'CDK创建进度查询';
    	let data = ctx.query;
    	let result = await CDKService.cdkFind(data);
    	ctx.body = statusCode.SUCCESS_200('创建成功', result);
	}
	@get('/cdkDownload')
	async  cdkDownload(ctx) {
		ctx.log.resourceDesc = 'CDKkey下载';
		let {data} = ctx;
		let { tablename } = data;
		let filename = `${tablename}.csv`;
		let filepath = path.join(__dirname, `../../cdk/${filename}`);
		console.log(filepath);
		await sendflie(ctx, decodeURI(filepath));
		
	}
	@get('/find')
	async find(ctx) {
    	ctx.log.resourceDesc = 'CDK查找';
    	let data = ctx.query;
    	let result = await CDKService.find(data);
    	ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}
}