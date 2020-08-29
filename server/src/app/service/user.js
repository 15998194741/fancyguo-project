import UserDao from '../dao/user';
import BaseService from '../../lib/base-service';
import statusCode from '../../utils/status-code';
const jwt = require('jsonwebtoken');
const secret = require('../../config/secret.json');
const bcrypt = require('bcryptjs');
const request = require('request');
const jwtSimple = require('jwt-simple');
import logUtil from '../../utils/logs';
import { chain } from 'ramda';

function packTokenByUser(user, password) {
	if (user == null || user === undefined) {
		throw statusCode.ERROR_403('用户不存在');
	}
	if (!user.password) {
		throw statusCode.ERROR_403('请点击使用青果统一登录方式进行登录');
	}
	if (!bcrypt.compareSync(password, user.password)) {
		throw statusCode.ERROR_403('用户名或密码错误');
	}
	user.password = '';
	const token = jwt.sign(user, secret.sign, { expiresIn: secret.tokenExpiresTime });
	return {
		id: user.id,
		username: user.username,
		nickName: user.nickName,
		avatar: user.avatar,
		token: token
	};
}


class UserServer extends BaseService{
	constructor() {
		super(UserDao);
	}
  
	async findUser(id, game) {
		let games = await UserDao.findSqlByParamsToList('SELECT gm_game.game_name,gm_game.id from (gm_user LEFT JOIN gm_purview on gm_purview.uid=gm_user.id) LEFT JOIN gm_game on gm_game.id = gm_purview.gid where gm_user.id=:id', {id});
		if (game === undefined){
			game = games[0].game_name;
		}
		let routes = await UserDao.findSqlByParamsToList('select gm_url_purview.grede AS meta,gm_url.name,gm_url.url,gm_url.id AS urlid,gm_url.pid  from (((gm_user LEFT JOIN gm_purview ON gm_purview.uid=gm_user.id) LEFT JOIN gm_game on gm_game.id= gm_purview.gid)LEFT JOIN gm_url_purview on gm_url_purview.purview_id = gm_purview.id )left join gm_url on gm_url.id = gm_url_purview.url_id where gm_user.id=:id and gm_game.game_name = :game', { id, game});
		let routerfater = routes.map(val=>{
			if(val.pid===0){
				return { 'name': val.name, 'urlid':val.urlid, 'grede':val.grede};
			}else{
				return val;
			}
		});
		routes = routerfater.filter(item => {
			// 解构数据
			let { pid } = item;
			// 没有 pid 的都是一级菜单
			if(!pid) { return true; }
      
			let parent = routerfater.find(({ urlid }) => urlid === pid);
			// 如果不存在创建数组
			if(!parent.children) { parent.children = []; }
			// 添加至父节点
			if(parent.children.includes(item)) {
				return false;
			}else{
				parent.children.push(item);
			}
		});
		games= games.map(val => val.game_name);
		let gameid = await UserDao.findSqlByParamsToOne('select id from gm_game where game_name=:gamename', {gamename:game});

		routes.map(item => {
			try{
				item.children.sort((a, b) => a.urlid-b.urlid);
			}catch{}
			return {...item};
		});
		try{
			routes.sort((a, b) => a.urlid-b.urlid);
		}catch{}
		// console.log(routes);
		return {routes, games, gamename:game, gameid:gameid.id};
	}
  


	async handelToken(token) {
		return jwt.verify(token, secret.sign, function(err, decode) {
			return new Promise((resolve, reject)=> {
				if (err) {
					reject(err);
				} else {
					resolve(decode);
				}
			});
		});
	}

	async loginNative(username, password) {
		// 判断用户是否存在 用户名
		let user;
		if ((user = await UserDao.findByParam({ username: username, status: 1 })).length > 0) {
			return packTokenByUser(user[0], password);
		} else if ((user = await UserDao.findByParam({ email: username, status: 1 })).length > 0) {
			return packTokenByUser(user[0], password);
		} else {
			throw statusCode.ERROR_403('用户不存在');
		}
	}

	async loginOther(token) {
		// 解析token
		const otherUser = await this.handelToken(token);
		// 判断 在本数据库中是否存在该用户
		let userList = await UserDao.findSqlByParamsToList('select * from auth_user where status != 0 and source = 2 and username = :username', { username: otherUser.username });
		// 判断当前用户是否存在重复数据
		for (let user of userList) {
			if (user.status === 2) {
				logUtil.debug(`[统一登陆][离职用户尝试登陆]${user.id}|${user.username}|${user.nickName}|${user.alias}`);
				throw statusCode.ERROR_592('离职用户尝试登陆');
			}
		}
		let user = userList[0];
		let newToken;
		if (!user) {
			// 未在WP用户中，
			throw statusCode.ERROR_593('请联系管理员同步您的用户信息到WP中');
		}
		newToken = jwt.sign(user, secret.sign, { expiresIn: secret.tokenExpiresTime });
		return {
			id: user.id,
			username: user.username,
			nickName: user.nickName,
			avatar: user.avatar,
			alias: user.alias,
			token: newToken
		};
	}

}

export default new UserServer();