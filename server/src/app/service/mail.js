import { dbSequelize } from '../../config';
const Sequelize = require('sequelize');
import dayjs from 'dayjs';

class MailService{
	constructor() {
	}
	async queryByParms(data){
		let {createTime, channel, servername, annex, Id:id } = data;
		let {gameid:game_id, plaform, pagesize, page} = data; 
		let condition  = {game_id,  plaform, id };
		let where = 'where '; 
		let whereObj =[];
		for(let i in condition){
			if(!condition[i]){continue;}
			whereObj.push( ` ${i}= '${condition[i]}'`);
		}
		
		where += whereObj.join('  and  '); 
		channel = channel ?typeof channel === 'string'? [channel]:channel:false;
		servername = servername ?typeof servername === 'string'? [servername]:servername:false;
		annex = annex ?typeof annex === 'string'? [annex]:annex:false;
		where += !createTime?'':` and create_time between '${createTime[0]}' and  '${createTime[1]}'`;
		where += !channel ? '': ` and channel @> '[${channel.map(item => `"${item}"`)}]'::jsonb  `;
		where += !annex ? '': ` and annex @> '[${annex.map(item => `{"ID":"${item}"}`).join(',')}]'::jsonb  `;
		where += !servername ? '': ` and servername @> '[${servername.map(item => `${item}`).join(',')}]'::jsonb  `;
		console.log(where);
		let sql = `
			with asd as (			
				select * from gm_smtp ${where} limit ${pagesize} offset ${pagesize*(page-1)} 
			)	,
			dsa as (select * from gm_server),
			ssss as( 
			select asd.servername, string_to_array(string_agg(dsa.servername, ','),',') as servernames from asd LEFT JOIN dsa on dsa.serverid::jsonb <@ (asd.servername)
			GROUP BY  asd.servername),
			qweqweqwe  as (select asd.* ,ssss.servernames from asd left join ssss on ssss.servername = asd.servername),
			asdasd as (select jsonb_array_elements(annex) ->> 'ID' as names, jsonb_array_elements(annex) ->> 'number' as numbers ,id  from  qweqweqwe ),
			qweqwe as (select asdasd.id,string_to_array(string_agg(concat(gm_article.name,'  ',asdasd.numbers,'个'),','),',') as annexnames from asdasd left JOIN gm_article on gm_article.article_id = asdasd.names GROUP BY asdasd.id )
			select * from asd left join qweqwe on qweqwe.id = asd.id
		`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		let totalsql = `
		select count(*) as total from gm_smtp ${where}
		`;
		let ress = await dbSequelize.query(totalsql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		return {data:res, total:ress[0].total?ress[0].total:0};
	}
	async getQueryAnnexOptions(data){
		let {gameid } = data;
		let res = await dbSequelize.query(`select classification as label , classification as value from gm_article where gameid =${gameid} GROUP BY classification  `);
		return res[0];
	}
	async getQueryAnnexOptionsLazy(data){
		let { gameid, label } = data;
		let res = await dbSequelize.query(`select name as label , article_id as value  , TRUE as leaf  from gm_article where gameid =${gameid} and classification = '${label}' `);
		return res[0];
	}
	async getQueryAnnexServernames(data){
		let { gameid } = data;
		let res = await dbSequelize.query(`with tableone as (select servername from gm_server GROUP BY servername having count(servername)>1),
        tabletwo as (select min(id) from gm_server GROUP BY servername HAVING count(servername)>1),
        tablethere as (select min(id) from gm_server GROUP BY servername HAVING count(servername)=1),
        tablemain as (select * from gm_server)
        select serverid as value ,servername as label from  tablemain where   tablemain.gameid = ${gameid} and  tablemain.id in (select * from tablethere ) or  tablemain.servername in  (select * from  tableone) and tablemain.id in (select * from  tabletwo)  `);
		return res[0];
	}
	async getPlaformChannelToservername(data){
		let { gameid, channel, plaform } = data;
		if(typeof channel ==='string'){
			channel = [channel];
		}
		let res = await dbSequelize.query(`select servername as label ,serverid as value from gm_server  where gameid =${gameid} and plaform ='${plaform}' and channel = array[${channel.map(item => `'${item}'`)}]::varchar[]  `);
		return res[0];
	}
	async postMailToCreate(data){
		let {gameid, title, text, mailLink:link, channel, plaform, Annex, serverName, roleId, smtpId, sendTime, sendDateTime} =data;
		console.log(data);
		if(Annex){
			for(let i in Annex){
				Annex[i] = JSON.stringify(Annex[i]);
			}
		}
		console.log(typeof serverName);
		if(typeof serverName == 'string' || serverName.length === 0){
			serverName = null;
		}else if(serverName.length >1){
			serverName = `'[${serverName}]'`;
		}else{
			serverName = `'${serverName}'`;
		}
		sendTime = sendTime?new Date():sendDateTime;	
		sendTime = dayjs(sendTime).format('YYYY-MM-DD HH:mm:ss'); 
		let sql = ` 
        insert into  gm_smtp  
        (game_id,title,text,link,channel,plaform,annex,serverName,roleid,smtp_id,sendtime)
        values
        (${gameid},'${title}','${text}','${link}',${channel.length?`'${JSON.stringify(channel)}'`:null},${plaform?`'${plaform}'`:null},${Annex?Annex.length >1?`'[${Annex}]'` :`'[${Annex}]'`:null},${serverName},'${roleId}','${smtpId}','${sendTime}') RETURNING id
		`;
		let res = await dbSequelize.query(sql);
		return res[0][0];
	}
    
	async annexAllQuery(data){
		let {gameid } = data;
		let res = await dbSequelize.query(`select 
        name as label ,
        article_id as value  from gm_article where gameid=${gameid}
        
        `);
		return res[0];
        
	}
	async findServerName(data){
		let { gameid } = data;
		let sql = ' select * from ';
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
	}
	async mailSendTimely(data){
		console.log('及时发送');
		console.log(data);
	}
	async mailSendTiming(data){
	
		let {sendtime, id} = data;
		let sql = `update gm_smtp set sendtime = '${sendtime}' where id = ${id} `;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		return res;
	}
	async maxID(data){
		let { gameid } = data;
		let sql = ` select MAX(id) from gm_smtp where game_id= ${gameid}`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		return res[0];
	}

}
export default new MailService();
