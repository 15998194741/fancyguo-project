import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import gmServerService from '../service/gm-server';
import statusCode from '../../utils/status-code';
@controller('/gm/server')
export class GmServerController {
  @get('/findAll')
	async findAll(ctx) {
		ctx.log.resourceDesc = '查找全部数据';
		const result = await gmServerService.findAll();
		ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}
  @get('/findById/:id')
  async findById(ctx) {
  	ctx.log.resourceDesc = '根据id查找数据';
  	const result = await gmServerService.findById(ctx.params.id);
  	ctx.body = statusCode.SUCCESS_200('查找成功', result);
  }
  @post('/')
  async create(ctx) {
  	ctx.log.resourceDesc = '新增数据';
  	if(!ctx.user) throw statusCode.ERROR_501('用户未登录');
  	const result = await gmServerService.create(ctx.request.body);
  	ctx.body = statusCode.SUCCESS_200('新增成功', result);
  }
  @put('/')
  async update(ctx) {
  	ctx.log.resourceDesc = '修改数据';
  	if(!ctx.user) throw statusCode.ERROR_501('用户未登录');
  	const result = await gmServerService.updateById(ctx.request.body);
  	ctx.body = statusCode.SUCCESS_200('修改成功', result);
  }
  @del('/')
  async delete(ctx) {
  	ctx.log.resourceDesc = '逻辑删除数据';
  	if(!ctx.user) throw statusCode.ERROR_501('用户未登录');
  	const result = await gmServerService.logicDeleteByIdToUserId(ctx.request.body.id, ctx.user);
  	ctx.body = statusCode.SUCCESS_200('删除成功', result);
  }
}
