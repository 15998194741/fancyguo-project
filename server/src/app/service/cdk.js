import { dbSequelize } from '../../config';
const Sequelize = require('sequelize');
import mongodb from '../../config/mongoDBconfig';
import dayjs from 'dayjs';






class CDKService{
	constructor() {
	}
	async createcdk(data){
		let { name, type, quantity, plaform, channel, takeEffectTime, failureTime, title, text, annexList, gameid, cdkkey} = data;
		console.log(takeEffectTime, failureTime);
		let sql = `INSERT into gm_cdk  
		 ( "name",type ,num,plaform,channel,start_time,end_time,content,title,game_id,annex)
		 values
		 ('${name}','${type}','${quantity}','[${plaform.map(item => `"${item}"`)}]','[${channel.map(item => `"${item}"`)}]','${dayjs(takeEffectTime).add(8, 'hour')}','${dayjs(failureTime).add(8, 'hour')}','${text}','${title}',${gameid},'${JSON.stringify(annexList)}') returning id `;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		let id = res[0]['id'];
		if(+type === +1){
			new Promise((resolove, reject)=>{
				this.cdkOnly({cdkkey, id});
			});
			return id;
		}
		let args = {num:quantity, id};
		new Promise((resolove, reject ) => {
			this.cdkGenerate(args);
		});
		return id;
	}
	async cdkOnly(data){
		let {cdkkey, id} =data;
		await mongodb.create(cdkkey, {'key':'String',
			'isUse':'Boolean',
			'roleid':'String',
			'plaform':'String',
			'channel':'String'});
		
		await dbSequelize.query(`update  gm_cdk set cdkid = '${cdkkey}' where id =  ${id}`);
	}
	//cdk生成插入mongo
	async cdkGenerate(data){
		let {id, num} = data;
		function ls(nums){
			let g = [
				'A', '9', 'D', '4', 'a', 'h', 'N', 'E', 'l',
				'1', 'v', 'J', '6', 'x', 'g', '7', '3', 'e',
				'm', 'w', 'B', 't', 'T', 'q', 'P', 'F', 'K',
				's', 'C', 'Y', 'M', 'S', 'j', 'H', 'z', 'V',
				'o', 'Q', '8', '5', 'r', 'u', 'c', 'Z', 'f',
				'G', 'b', 'O', '2', 'p', 'U', '0', 'L', 'd',
				'n', 'k', 'R', 'i', 'y', 'W', 'X', 'I'
			  ];
			let i = nums;
			let j = '';
			while (i >= 62) {
				var index = Number(parseInt(i % 62));
				j = g[index] + j;
				i = Number(parseInt(i / 62));
			}
			j = g[i] + j;
			return j;
		}
		let tableName = ls(Number(id)+238328);
		dbSequelize.query(`update  gm_cdk set cdkid = '${tableName}' where id =  ${id}`);
		await mongodb.create(tableName, {'key':'String',
			'isUse':'Boolean',
			'roleid':'String',
			'plaform':'String',
			'channel':'String'});
		let list = [
			's', 'Y', 'h', 'D', 'O', '4', 'T', 'B', 'o',
			'Z', 'j', 'b', 'w', 'A', 'd', '3', 'Q', 'L',
			'J', 'I', 'v', '0', 'l', 'R', 'x', 'u', 'r',
			'i', 'V', 'G', 'W', 'S', 'n', 'e', '6', 'C',
			'N', 'K', 'E', 'm', 'q', 'p', 't', '9', 'P',
			'8', 'a', 'X', 'k', 'z', '7', 'f', '1', 'U',
			'y', 'H', 'g', '2', 'M', '5', 'F', 'c'
		];
		function* generate() {
			let i = num;
			let j = '';
			let g = shuffle(list);
			let value;
			while(i--) {
				j = '';
				for(let k=1;k<=6;k++){
					value = parseInt(62*Math.random());
					j = j + g[value];
		
				}
				yield tableName+j;
			}
		}
		function shuffle(arr) {
			let i = arr.length;
			while (i) {
				let j = Math.floor(Math.random() * i--);
				[arr[j], arr[i]] = [arr[i], arr[j]];
			}
			return arr;
		}
		// let lists= [];
		for( let i of  generate()){
			// lists.push({'key': i, 'isUse': false });
			await mongodb.insertData(tableName, {'key': i, 'isUse': false } );
		}
		

		// await mongodb.insertManyData(tableName, lists );
		
		new Promise((resolove, reject ) => {
			data['tablename'] = tableName;
			this.cdkToCsv(data);
		});
	}
	//cdk兑换
	async cdkConvert(data){
		let{ key } =data;
		let tableName = key.split('', 4).join('');
		let sql = `select * from gm_cdk  where cdkid = '${tableName}' `;
		let dbres = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		dbres = dbres[0];
		let { type, start_time:startTime, end_time:endTime, annex} = dbres;
		let now = new Date();
		startTime = new Date(startTime);
		endTime = new Date(endTime);
		if(!(now> startTime && endTime> now)){return '已过期';}
		let res ;
		switch (+type){
			case +1 :  console.log('唯一cdk');res = await this.cdkOnlyOne(data);return res?annex:'cdk不存在';
			case +2 :  console.log('互斥cdk');res = await this.cdkMutually(data);return res?annex:'cdk不存在';
			case +3 :  console.log('通用cdk');res =  await this.cdkUniversal(data);return res?annex:'cdk不存在';
			default:return '错误值';
		}
	}
	//唯一cdk兑换

	async cdkOnlyOne(data){
		let { key }=data;
		let res = await mongodb.findOne(key, {...data});
		if(!res){
			await mongodb.insertData(key, {...data});
			return true;
		}
		return false;
	}
	//互斥cdk兑换
	async cdkMutually(data){
		let {key, roleid} = data;
		let tableName = key.split('', 4).join('');
		let isUse = false;
		let res = await mongodb.findOne(tableName, {roleid});
		if(res){
			return false;
		}
		res = await mongodb.findAndUpdate(tableName, {key, isUse}, {...data, isUse:!isUse});
		return res;
	}
	//通用cdk兑换
	async cdkUniversal(data){
		let{ key } =data;
		let tableName = key.split('', 4).join('');
		let isUse = false;
		let res = await mongodb.findAndUpdate(tableName, {key, isUse}, {...data, isUse:!isUse});
		return res;
	}
	//cdk进度
	async cdkCreateSchedule(data){
		let {tablename} = data;
		let res = await mongodb.count(tablename);
		let sql = `select num , table_true as tabelTrue  from gm_cdk where cdkid = '${tablename}' `;
		let num =  await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		try{
			num = num[0]['num'];
			let schedule = 0;
			if(res/res === num/num){
				schedule = res/num;
			}
			let tableTrue = num[0]['tabelTrue'];
			return tableTrue?1:schedule*0.5;
		}catch (err){
			return '啥也没有';
		}
	}
	//cdk转换成csv
	async cdkToCsv(data){
		const fs = require('fs');
		const { Readable } = require('stream');
		let { tablename, num, id}  = data;
		  async function*  generate(nums) {
			let i = 100;
			let j =  0;
			let res;
			while(true) {
				res = await mongodb.find(tablename, i, j);
				for(let o of res){
					yield o['key']+'\n';
				}
				j =j  + 100;
				if(+j >= +nums){
					return null;
				}
			}
		}
		let readable = Readable.from(generate(num));
		let writable = fs.createWriteStream(`./src/cdk/${tablename}.csv`);
		readable.pipe(writable);
		readable.on('end', ()=>{
			dbSequelize.query(`update  gm_cdk set table_true = 1 where id =  ${id} `);
		});
	}
	
	async find(data){
		let where = {};
		for(let [key, value] of Object.entries(data)){
			if(value){where[key]=value;}
		}
		let res;
		if(where['value']){
			res = await this.findByKey(where); 
		}else{
			res = await this.findByFilter(where);
		}
		
		return res;
	}
	async findByKey(data){
		let {key} = data;
		switch (key){
			case 'CDKID' :return byCdkId(data);
			case 'CDKKEY': return byCdkKey(data);
		}
		async function byCdkId(data){
			let {gameid, value} = data;
			let sql = `
				
				with asd as (select (jsonb_array_elements(annex) ->> 'annexName')::jsonb ->> 1  as name, jsonb_array_elements(annex) ->> 'annexNumber' as numbers ,id  from  gm_cdk),
				dsa as (select  asd.id, string_to_array(string_agg(concat(art.name,'  ',asd.numbers,'个'),','),',')  as annexs  from asd  left join gm_article art on art.article_id = asd.name GROUP BY asd.id ),
			sda as (select cdk.*,dsa.annexs   from dsa left join  gm_cdk cdk on dsa.id = cdk.id where cdk.game_id='${gameid}' and cdk.id=${ value } ),
			pla as (select  jsonb_array_elements(plaform) as plaform ,id from gm_cdk  where id in (select id from sda)),
			pls as (select id,string_to_array(string_agg((case 
			when pla.plaform = '"1"' then '安卓'
			when pla.plaform = '"2"' then '苹果'
			end),','),',') as plaforms  from pla  GROUP BY pla.id)
			select  sda.*,pls.plaforms  from sda left JOIN pls on pls.id=sda.id 
				
				
				`;
		
			let res =   await dbSequelize.query(sql, {
				replacements:['active'], type:Sequelize.QueryTypes.SELECT
			});
			if(res){
				res.map(item => {
					item['start_time']= dayjs(item['start_time']).format('YYYY-MM-DD HH:mm:ss');
					item['end_time']= dayjs(item['end_time']).format('YYYY-MM-DD HH:mm:ss');
				});
			}

			return {res, total:1};
		}
		async function byCdkKey(data){
			let {gameid, value:key} = data;
			let tableName = key.split('', 4).join('');
			let sql = `

			with asd as (select (jsonb_array_elements(annex) ->> 'annexName')::jsonb ->> 1  as name, jsonb_array_elements(annex) ->> 'annexNumber' as numbers ,id  from  gm_cdk),
			dsa as (select  asd.id, string_to_array(string_agg(concat(art.name,'  ',asd.numbers,'个'),','),',')  as annexs  from asd  left join gm_article art on art.article_id = asd.name GROUP BY asd.id ),
		sda as (select cdk.*,dsa.annexs   from dsa left join  gm_cdk cdk on dsa.id = cdk.id where cdk.game_id='${gameid}' and case 
		when cdk.type = '1'
		then cdk.cdkid = '${key}'
		else cdk.cdkid = '${tableName}'
		end
		),
		pla as (select  jsonb_array_elements(plaform) as plaform ,id from gm_cdk  where id in (select id from sda)),
		pls as (select id,string_to_array(string_agg((case 
		when pla.plaform = '"1"' then '安卓'
		when pla.plaform = '"2"' then '苹果'
		end),','),',') as plaforms  from pla  GROUP BY pla.id)
		select  sda.*,pls.plaforms  from sda left JOIN pls on pls.id=sda.id 
			`;
			let res =   await dbSequelize.query(sql, {
				replacements:['active'], type:Sequelize.QueryTypes.SELECT
			});
			if(res){
				res.map(item => {
					item['start_time']= dayjs(item['start_time']).format('YYYY-MM-DD HH:mm:ss');
					item['end_time']= dayjs(item['end_time']).format('YYYY-MM-DD HH:mm:ss');
				});
			}
			let total  = 1;
			if(!res[0]){return null;}
			let type = res[0]['type'];
			if(+type === +1){return {res, total};}
			let resTrue = await mongodb.findOne(tableName, {key});
			
			return resTrue?{res, total}:null;
		}
	}
	async findByFilter(data){
		let { plaform, channel, page, pagesize, takeEffectTime, srtfailureTimetime, gameid} = data;
		console.log(data);
		let where = `where cdk.game_id='${gameid}' `;
		where += !plaform?'':` and cdk.plaform = '["${plaform}"]'::jsonb  `;
		where += !takeEffectTime?'':` and cdk.start_time between  '${takeEffectTime[0]}' and '${takeEffectTime[1]}'  `;
		where += !srtfailureTimetime?'':` and cdk.start_time between  '${srtfailureTimetime[0]}' and '${srtfailureTimetime[1]}'  `;
		where += !channel?'':` and cdk.channel =  '[${typeof channel ==='string'?[channel].map(item => `"${item}"` ): [...channel].map(item => `"${item}"` ) }]'::jsonb `;
		let sql = `
		with asd as (select (jsonb_array_elements(annex) ->> 'annexName')::jsonb ->> 1  as name, jsonb_array_elements(annex) ->> 'annexNumber' as numbers ,id  from  gm_cdk),
		dsa as (select  asd.id, string_to_array(string_agg(concat(art.name,'  ',asd.numbers,'个'),','),',')  as annexs  from asd  left join gm_article art on art.article_id = asd.name GROUP BY asd.id ),
	sda as (select cdk.*,dsa.annexs   from dsa left join  gm_cdk cdk on dsa.id = cdk.id ${where}  limit ${pagesize} offset ${pagesize*(page-1)}   ),
	pla as (select  jsonb_array_elements(plaform) as plaform ,id from gm_cdk  where id in (select id from sda)),
	pls as (select id,string_to_array(string_agg((case 
	when pla.plaform = '"1"' then '安卓'
	when pla.plaform = '"2"' then '苹果'
	end),','),',') as plaforms  from pla  GROUP BY pla.id)
	select  sda.*,pls.plaforms  from sda left JOIN pls on pls.id=sda.id 
	`;
		
		let res =   await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		let totalSql = `  select count(id) as total  from gm_cdk cdk ${where} `;
		let total =   await dbSequelize.query(totalSql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		if(res){
			res.map(item => {
				item['start_time']= dayjs(item['start_time']).format('YYYY-MM-DD HH:mm:ss');
				item['end_time']= dayjs(item['end_time']).format('YYYY-MM-DD HH:mm:ss');
			});
		}
		total = total[0];
		return {res, total};
	}
	
	
	
	
	
	
	
	
	
	
	
	
	async test(data){
		let {tablename} = data;
		let i = 200;
		let j = 100;
		return await mongodb.find(tablename,  i, j);
	}


}

export default new CDKService();
