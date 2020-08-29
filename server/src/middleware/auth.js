const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
const util = require('util');
const verify = util.promisify(jwt.verify);
const statusCode = require('../utils/status-code');
export default async (ctx, next) => {
	try{
		for(let [key, value] of Object.entries(ctx.query)){
			if(key.slice(-2) === '[]'){
				ctx.query[key.slice(0, -2)] = value;
			}
			ctx.query[key] = value;
		}
		for(let [key, value] of Object.entries(ctx.request.body)){
			if(key.slice(-2) === '[]'){
				ctx.request.body[key.slice(0, -2)] = value;
			}
			ctx.request.body[key] = value;
		}

	}catch{

	}
	let token =ctx.request.headers['fancy-guo-login-token'];
	let gameid = ctx.request.headers['gameid'];
	if ( token=== undefined ) {
		ctx.body = statusCode.ERROR_590('权限异常');
		return false;
	}else{
		try{
			let user =  await verify(token, secret.sign);
			ctx.user = user;
			gameid?ctx.request.body['gameid'] = gameid:'';
			gameid?ctx.query['gameid'] = gameid:'';

		}catch{
			ctx.body = statusCode.ERROR_590('权限异常');
			return false;
		}
		await next();
	}
};
