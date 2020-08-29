import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import statusCode from '../../utils/status-code';
import CharacterService from '../service/Character';


@controller('/character')
export class CharacterController {
	@get('/query')
	async queryCharacter(ctx) {
		ctx.log.resourceDesc = '角色查询';
		let data = ctx.query;
		let result = await CharacterService.queryByParms(data);
		ctx.body = statusCode.SUCCESS_200('修改成功', result);
	}



	@get('/findServername')
	async findServername(ctx) {
		ctx.log.resourceDesc = '区服名称获取';
		let data = ctx.query;
		let result = await CharacterService.findServername(data.gameid);
		ctx.body = statusCode.SUCCESS_200('查询成功', result);
	}

	@post('/uploadFile')
	async uploadFile(ctx) {
		ctx.log.resourceDesc = '文件上传';
		let data = ctx.request.files;
		var gameid = ctx.request.body.gameid;
		let result = await CharacterService.uploadFile(data, gameid);
		// ctx.redirect('/api/character/findServername');
		ctx.body = statusCode.SUCCESS_200(result);
	}
	@post('/readfile')
	async readfile(ctx) {
		ctx.log.resourceDesc = '文件读取';
		let filepath = ctx.request.body.filepath;
		var gameid = ctx.request.body.gameid;
		let result = await CharacterService.readfilesData(filepath, gameid);
		ctx.body = statusCode.SUCCESS_200(result);
	}


	@get('/downloads')
	async downloads(ctx){
		ctx.log.resourceDesc = '文件下载';
		// let data = ctx.request.files;
		// var gameid = ctx.request.gameid;
		 // let result = await CharacterService.downloads(data, gameid);
		ctx.attachment(String.raw`E:\third\project\server\src\excel\1595423023791test.xlsx`);
		var paths = String.raw`E:\third\project\server\src\excel\1595423023791test.xlsx`;
		const send = require('koa-send');
		await send(ctx, paths);
		// ctx.body = statusCode.SUCCESS_200(result);
	}

	@put('/prohibitedMute')
	async prohibitedMute(ctx){
		// console.log(ctx.request.body);
		let result = await CharacterService.prohibitedMute(ctx.request.body);
		ctx.body = JSON.parse(result);
	}

	@get('/outputConsume')
	async outputConsume(ctx){
		let result = await CharacterService.outputConsume(ctx.query);
		ctx.body = statusCode.SUCCESS_200('查询成功', result);
	}




	@get('/backPackQuery')
	async backPackQuery(ctx){
		ctx.log.resourceDesc = '背包查询';

		// console.log(ctx.query);
		// console.log(ctx.parms);
		let result = await CharacterService.backPackQuery(ctx.query);
		ctx.body = statusCode.SUCCESS_200('查询成功', result);
	}
	@put('/backPackRecycle')
	async backPackRecycle(ctx){
		ctx.log.resourceDesc = '背包回收';
		// console.log(ctx.request.body);
		let result = await CharacterService.backPackRecycle(ctx.request.body);
		// console.log(result);
		// ctx.body = statusCode.SUCCESS_200('回收成功', result);
		ctx.body = result;
	}

}