import gmAnnouncementDao from '../dao/gm-announcement';
import { gmAnnouncementDO } from '../models/gm-announcement';
import BaseService from '../../lib/base-service';
import statusCode from '../../utils/status-code';
const beanUtils = require('../../utils/bean-utils');
import Cp from '../../utils/Cp';
import fs from 'fs';
import { dbSequelize } from '../../config';
import dayjs from 'dayjs';
import { title } from 'process';
class GmAnnouncementService extends BaseService{
	constructor() {
		super(gmAnnouncementDao);
	}
	async queryBulletin(data){
		let {bulletinid, plaform, servername, type, page, pagesize, gameid} =data;
		let setime = data['setime[]']; 
		let channel = data['channel[]'];
		let where = `where  game_id=${gameid} `;
		 data = {bulletinid, plaform,  type};
		for(let [key, value] of  Object.entries(data)){
			where += value?`and ${key} = '${value}'`:'';
		}
		where += servername? `and '${servername}' = any(servername)`:'';
		where += setime?` and create_time  between '${dayjs(setime[0]).format('YYYY-MM-DD HH:mm:ss')}' and '${dayjs(setime[1]).format('YYYY-MM-DD HH:mm:ss')}'`:'';
		switch(typeof channel){
			case 'string':where += ` and '${channel}' = any(client)`;break;
			case 'object':where += ` and array[${channel.map(item => `'${item}'`)}]::varchar[] <@ client`;break;
		}
		let res = await dbSequelize.query(`select * from gm_announcement  ${where} offset ${pagesize*(page-1)} limit ${pagesize}`);
		let total = await dbSequelize.query(`select count(*) as total  from gm_announcement  ${where} `);
		res = res[0];
		total = total[0][0].total;
		return {res, total};
	}
	async createBulletin(data, files, id){
		let cpdata = data;
		let cpfilename;
		try{
			 cpfilename = data.bulletinid + files.name;
		}catch{
			 cpfilename = '';
		}
		let Res = await Cp.insertBulletin(cpdata, cpfilename);
		let  {code :CpRes, msg:CpMsg} = JSON.parse(Res);
		if(+CpRes !== +200){return {CpMsg};}
		const path = require('path');
		  const file = files.images;
		  let filePath= await new Promise((resolve, reject)=>{
			const reader = fs.createReadStream(file.path);
			let filePath = path.join(__dirname, '../../images/') + `${data.bulletinid}+${file.name}`;
			const upStream = fs.createWriteStream(filePath);
			reader.pipe(upStream);
			reader.on('end', async(err)=>{
				if(err){
					reject(false);
				}
				resolve(filePath);
			});
		});
		let { channel } =data;
		if(channel.indexOf(',') != -1){
			channel = channel.split(',');
		}
		switch (typeof channel){
			case 'string':channel = `array['${channel}']`;break;
			case 'object':channel = `array[${channel.map(item => `'${item}'`)}]`;break;
			default :channel = null;
		}
		let sql = ` insert into gm_announcement 
		  (title,text,game_id,img_url,plaform,client,link,bulletinid,create_user_id,type) 
		  VALUES
		  ('${data.title}','${data.text}','${data.gameid}','${filePath}',${data.plaform?`'${data.plaform}'` :null},${channel},'${data.a}','${data.bulletinid}','${id}',2) `;
		let res = await dbSequelize.query(sql);
		return res[1];
	}
	async createMarquee(data, id){
		let cpdata = data;
		let Res = await Cp.insertMarquee(cpdata);
		let {code :CpRes, msg:CpMsg} = JSON.parse(Res);
		if(+CpRes !== +200){return {CpMsg};}
		let { channel, servername } =data;
		for(let [key, value] of Object.entries(data)){
			if(key === 'stime' || key === 'etime'){
				data[key] =	`'${dayjs(data[key]).format('YYYY-MM-DD HH:mm:ss')}'`;continue;
			}
			data[key]= data[key]?`'${value}'`:null;

		}
		if(channel.indexOf(',') != -1){
			channel = channel.split(',');
		}
		switch (typeof channel){
			case 'string':channel = `array['${channel}']`;break;
			case 'object':channel = `array[${channel.map(item => `'${item}'`)}]`;break;
			default :channel = null;
		}
		if(servername.indexOf(',') != -1){
			servername = servername.split(',');
		}
		switch (typeof servername){
			case 'string':servername = `array['${servername}']`;break;
			case 'object':servername = `array[${servername.map(item => `'${item}'`)}]`;break;
			default :servername = null;
		}
		let sql = ` insert into gm_announcement 
		  (start_time,end_time,game_id, plaform,client,bulletinid,create_user_id,type,weights,time_interval,servername) 
		  VALUES
		  (${data.stime},${data.etime},${data.gameid},${data.plaform?`${data.plaform}` :null},${channel},${data.bulletinid},${id},1,${data.weights} ,${data.interval},${servername}  ) `;
		let res = await dbSequelize.query(sql);
		return res[1];
	}
	async updateBulletin(data){
		let CpRes = await Cp.stopannouncement(data);
		let {code, msg} = JSON.parse(CpRes);
		if(code !== 200){return {msg};}
		let res = await dbSequelize.query(`update gm_announcement set anno_status=1 where id='${data.id}'`);
		return res[0][0];
	}
	async sendBulletin(datas){
		let { data, sendtime, gameid } = datas;
		let res = await dbSequelize.query(`update gm_announcement set sendtime='${sendtime}',anno_status =2 where id in (${data.map(item => item.id)}) `);
		await Cp.sendBulletin(gameid, data.map(item => item.id));
		return res;
	}
	async queryweights(parmas){
		let whereObj = {};
		for(let [key, value] of Object.entries(parmas)){
			if(!value || key.slice(-2) === '[]' ){continue;}
			whereObj[key] = value;
		}
		let { stime, etime, gameid, channel, plaform, servername } = whereObj;
		if(typeof servername === 'string'){servername = [servername];}
		servername = servername?` and servername = array[${servername.map(a=>`'${a}'`)}]::varchar[]` :'';
		if(typeof channel ==='string'){channel = [channel];}
		channel = channel?` and client = array[${channel.map(a=>`'${a}'`)}]::varchar[]` :'';
		plaform = plaform?` and plaform = '${plaform}'`:'';
		if (!(stime && etime)){return [];}
		let res = await dbSequelize.query(`
		select weights as label , weights as value 
		from gm_announcement  
		where game_id = '${gameid}' and type = '1' ${channel} ${plaform} ${servername}
		and  ('${stime}' BETWEEN start_time and  end_time  
		or '${etime}' BETWEEN start_time and  end_time 
		or start_time BETWEEN '${stime}' and  '${etime}'  
		or end_time BETWEEN '${stime}' and  '${etime}')  `);
		return res[0];
	}
	async queryservernames(data){
		let {gameid, plaform, channel} = data;
		 if(plaform && channel){
			if(typeof channel ==='string'){channel = [channel];}
			let servernames  = await dbSequelize.query(`
				select servername as label,servername as value  from gm_server 
				where gameid=${gameid} and plaform ='${plaform}'  
				and channel = array[${channel.map(a=>`'${a}'`)}]::varchar[] 
				and servername = servername`);
			return servernames[0];
		}
	}
	async putchangeoneannounced(data){
		let  Marquee = async (data)=>{
			let CpRes = await Cp.updateMarquee(data);
			let {code, msg} = JSON.parse(CpRes);
			if(code !== 200){return {msg};}
			let {id, text, start_time, end_time, weights} = data;
			let res = await dbSequelize.query(`update gm_announcement 
			set text = '${text}',
			start_time = '${start_time}',
			end_time = '${end_time}' ,
			weights = '${weights}'
			where id = ${id}`);
			return res[0];
		};
		let  bulletin = async (data)=>{
			let CpRes = await Cp.updateBulletin(data);
			let {code, msg} = JSON.parse(CpRes);
			if(code !== 200){return {msg};}
			let {id, text, title, link} = data;
			let res = await dbSequelize.query(`update gm_announcement 
			set text = '${text}',
				title = '${title}',
				link = '${link}'
			where id = ${id}`);
			return res[0];
		};
		let res;
		switch(data.type){
			case '跑马灯':res = await Marquee(data);break;
			case '公告板':res = await bulletin(data);break;
		}
		return res;
		
	}
}
export default new GmAnnouncementService();