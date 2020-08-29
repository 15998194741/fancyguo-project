import gmServerDao from '../dao/gm-server';
import { gmServerDO } from '../models/gm-server';
import BaseService from '../../lib/base-service';
import statusCode from '../../utils/status-code';
const beanUtils = require('../../utils/bean-utils');
import { dbSequelize } from '../../config';
import dayjs from 'dayjs';
class GmServerService extends BaseService{
	constructor() {
		super(gmServerDao, gmServerDO);
		this.gmServerDao=gmServerDao;
		this.gmServerDO = gmServerDO;
	}
  
	//区服按需查找
	async serverFindByParam(findForm) {
	
		let getType = data => Object.prototype.toString.call(data).split(' ')[1].slice(0, -1);
		let srttime = findForm['srttime[]'];
		let channel = findForm['channel[]'];
		let { plaform, display, load, gameid, test, page, pagesize, mergeserver, key, value} = findForm;
		findForm = {
			plaform, display, load, gameid, test
		};
		let  whereObj = {};
		for (const key in this.gmServerDO) {
			if (findForm[key] && findForm[key]!='0') {
				whereObj[key] = findForm[key];
			}
		}
		findForm = null;
		let where = [];
		if (whereObj){
			for( let [key, value] of Object.entries(whereObj)){
				where.push(`${key}='${value}'`); 
			}
			where = 'where '  + where.join(' and ');
			whereObj = null;
		}
		if(getType(channel)!= 'Undefined'){
			where += getType(channel)==='String'?` and '${channel}'=ANY(channel) `:` and array[${channel.map(item=>{
				return `'${item}'`;
			})}]::varchar[] <@  channel `;
		}
		
		// where += channel && channel.length > 0? ' and array[\''+channel.join(' ')+'\']::varchar[] <@  channel ':'';
		where += srttime?` and srttime BETWEEN '${srttime[0]}' and '${srttime[1]}' `:'';
		where += test?`and test='${test}'`:'';
		where += mergeserver?` and ${+mergeserver===1?'NOT':''}(childrens is null)`:'';
		if(value){
			where += key ==='serverid'?` and serverid = '${value}'`: ` and serverid='${value}' and not(childrens is null)   `;
		}
		
		// console.log(where);
		let selectSql = `select * from gm_server  ${where} and (pid is null or  trim(pid) ='') order by id limit ${pagesize} offset (${pagesize}*${page-1})`;
		
		let arr =  await dbSequelize.query(selectSql);
		let totalSql = `select count(*) as total from gm_server ${where} and (pid is null or  trim(pid) ='')  `;
		// console.log(totalSql);
		let totals = await dbSequelize.query(totalSql);
	
		let {total} = totals[0][0];
	
		arr.map(value => value.dataValues);
		// let  total = arr[0].length;
		let displayNumSql = `SELECT count(display) as num,display  from gm_server where id in ( SELECT id from gm_server ${where} and (pid is null or  trim(pid) ='')  ORDER BY id limit ${pagesize} offset (${pagesize}*${page-1}) ) GROUP BY display `;
		let displayNum = await dbSequelize.query(displayNumSql);
	
		let pidarr = [];
		if(arr[0].length > 0){
			 pidarr = arr[0].map(item =>{
				return item.childrens?{...item, hasChildren: true}:item;
			});
		}
		// console.log(pidarr);
		let res = {
			total,
			table:pidarr,
			displayNum:displayNum[0],
			page
		};
		return res;
	}


	async findServerByID(query){

		let where = `where pid='${query.id}' and gameid='${query.gameid}'`;
		// if(query.value === ''){	
		// 	 where = `where gameid='${query.gameid}'`;
		// }
		let idFindSql = `SELECT *   from gm_server ${where}`;
		let res = await dbSequelize.query(idFindSql);
		return res[0]; 
	}
	async mergeServer(data){
		let children = data.map(item=> {return `'${item.serverid}'`;});
		let pid = dayjs(new Date()).format('YYMMDDHHmmss');
		let channel = data[0].channel.map(item => {return `'${item}'`;});
		let plaform =  data[0].plaform;
		let test =data[0].test;
		let querySql = `insert into gm_server (serverid ,childrens,gameid,channel,plaform,display,test)VALUES ('${pid}',array[${children.join(',')}],'${data.gameid}',array[${channel.join(',')}],'${plaform}','3','${test}')  `;
		let res = await dbSequelize.query(querySql);
		return res;
	

	}
	idRandom(lengths) {
		let randomString = '';
		for (let i = 0; i < lengths; i++) {
		  randomString += Math.ceil(Math.random() * 10).toString();
		}
		return randomString;
	  }

}

export default new GmServerService();


