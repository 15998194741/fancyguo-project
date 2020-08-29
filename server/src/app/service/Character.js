import { dbSequelize } from '../../config';
import Ta from '../../utils/requests';
import Cp from '../../utils/Cp';
import fs from 'fs';

class CharacterService{
	constructor() {
		
	}

	static byData(data){
		let  whereObj = {};
		for (const key of Object.keys(data)) {
			data[key] && data[key]!='0'?whereObj[key] = data[key]:'';
		}
		
		if(Object.keys(whereObj).length === 0){return '' ;}
		data = null;
		let keyss= ['update_time', 'ip', 'distinct_id', 'account_id'];
		let where = [];
		if (whereObj){
			for( let [key, value] of Object.entries(whereObj)){
				keyss.includes(key)?where.push(` "#${key}"='${value}'`):where.push(` ${key}='${value}'`); 
			}
			where = where.join(' and ');
			whereObj = null;
		}

		return where;
	}
	static byBetween(data){
		let  whereObj = {}; 
		for(const key of Object.keys(data)){
			data[key] && data[key].length !=0?whereObj[key] = data[key]:'';
		}
		data = null;
		let wheres=[];
		let keyss= ['update_time', 'ip', 'distinct_id', 'account_id'];
		if(whereObj){
			for(let [key, value] of Object.entries(whereObj)){
				keyss.includes(key)?wheres.push(` and  "#${key}" BETWEEN '${value[0]}' and '${value[1]}' `):wheres.push(`  and  "${key}" BETWEEN '${value[0]}' and '${value[1]}' `);
			}
			
		}
		wheres = wheres.join('  ');
		return wheres;
	}
	static byInArray(data){
		let  whereObj = {}; 
		for(const key of Object.keys(data)){
			data[key] && data[key].length !=0?whereObj[key] = data[key]:'';
		}
		data = null;
		let wheres=[];
		let keyss= ['update_time', 'ip', 'distinct_id', 'account_id'];
		if(whereObj){
			for(let [key, value] of Object.entries(whereObj)){
				
				if(typeof(value)==='string'){keyss.includes(key)?wheres.push(` and  "#${key}" = '${value}' `):wheres.push(` and  "${key}" = '${value}' `);continue;}
				keyss.includes(key)?wheres.push(` and  "#${key}" in (${value.map(item =>`'${item}'`).join(',')})`):wheres.push(` and  "${key}" in (${value.map(item =>`'${item}'`).join(',')}) `);
			}
		}
		return wheres.join(' ');
		
	}

	static  byArrayIn(data){
		let  whereObj = {}; 
		for(const key of Object.keys(data)){
			data[key] && data[key].length !=0?whereObj[key] = data[key]:'';
		}
		data = null;
		let wheres=[];
		let keyss= ['update_time', 'ip', 'distinct_id', 'account_id'];
		if(whereObj){
			for(let [key, value] of Object.entries(whereObj)){
				wheres.push(` and    array[${value.map(item =>`'${item}'`).join(',')}]::varchar[] <@ "${keyss.includes(key)?'#':''}${key}" `);
			}
		}
		
		return wheres.join(' ');
		
	}
	static async byOne(sql){
		let res = await dbSequelize.query(sql);
		return res[0][0]?res[0][0]:'';
	
	
	}
	static async byMany(sql){
		let res = await dbSequelize.query(sql);
		return res[0]?res[0]:'';
	}

	static tosql(dict){
		let { between, inArray, arrayIn, data, many } = dict;
		let condition = 'where  ';
		condition += data?CharacterService.byData(data):'';
		condition += between?CharacterService.byBetween(between):'';
		condition += inArray?CharacterService.byInArray(inArray):'';
		condition += arrayIn?CharacterService.byArrayIn(arrayIn):'';
		let cre = /^where(\s*)and(.*)/;
		condition = condition === 'where'?'':condition.replace(cre, 'where $1 $2');
		let cer = /^where(\s*)$/;

		return cer.test(condition)?'':condition ;
		// let res =  many?CharacterService.byMany(condition):CharacterService.byOne(condition);
		// return res;

		
		


	}

	async queryByParms(data){
		let pgsql=0;
		let datare = /(.*)\[\]$/;
		let query ={};
		for(let [i, j] of Object.entries(data)){
			query[i.replace(datare, '$1')]=j;
		}
	
		let {
			key,
			value,
			regtime,
			stime,
			plaform,
			channel,
			servername,
			banned_type,
			banned_area,
			gameid,
			page,
			pagesize
		  } = query;
		
		  let token = await CharacterService.byOne(`select token,tablename from gm_game_token where gameid = '${gameid}' and type='user'`);
		  let tablename = token.tablename;
		  token = token.token;

		let many = true;
		let between ={
			regtime,
			stime
		}; 
		if(stime || banned_type ||  banned_area){
			data = {
				[key]:value,
				plaform,
				banned_area,
				banned_type,
				servername,
				gameid
			};
			tablename = 'gm_character';
			pgsql=1;
		}else{
			data = {
				[key]:value,
				plaform,
				banned_area,
				banned_type,
				servername,
			};
		}

		let inArray={
			channel
		};
		let sqls = CharacterService.tosql({
			inArray,
			between,
			data,
			many
		});
		var total = 0;
		if(key === 'role_name' && value){sqls += `or role_name like '%${value.split('').join('%')}%'`;}
		let res;
		if(pgsql === 1){
			let sql = `select * from gm_character ${sqls} offset ${pagesize*(page-1)} limit ${pagesize}  `; 
			var { total } = await CharacterService.byOne(`select count(*)as total from gm_character ${sqls} `);
		
			res =await CharacterService.byMany(sql);
		}else{
			let sql = `select  *  from ${tablename}  ${sqls} order by "#user_id" offset ${pagesize*(page-1)} limit ${pagesize}  `;	
			res =   await Ta.tasql(sql, token);
			sql = `select  count(*)  from ${tablename}  ${sqls}`;	
			total = await Ta.sqltoTotal(sql, token);
			if(!res){
				res='';
			}else{
				let children =  sqls?'':await CharacterService.byMany( `select * from gm_character  where gameid='${gameid}' and roleid in (${res.map(item => `'${item.roleid}'`)}) offset ${pagesize*(page-1)} limit ${pagesize}  `);
				if(children.length>0){
					res = res.map(item =>{
						let a = children.find(_item => _item.roleid===item.roleid);
						return {...item, ...a};
					});
				}
			
			}
		}
		// if(value && pgsql !==1 && res.length > 0){
		// 	console.log(res);
		// 	let wheres = res.map(item => item.roleid);
		// 	let sql = `select * from gm_character where gameid='${gameid}' and roleid in (${wheres.map(item=>`'${item}'`)})`; 	
		// 	console.log(sql);
		// 	let resu = await CharacterService.byMany(sql);
		// 	console.log(resu);

		// }
		return {res, total};
	}

	async findServername(gameid){
		let res = await dbSequelize.query(`select servername from gm_server where gameid='${gameid}'` );
		let arr = res[0];
		return arr.map(item=>{
			return {label:item.servername, value:item.servername};
		});

	}

	async uploadFile(data, gameid){
		const path = require('path');
		// 上传单个文件
		
		const file = data.file; // 获取上传文件
		let fileType = /(.*)[.xlsx,.xls]$/;
		if(!fileType.test(file.name)){return '文件格式不正确';}
		let filePath= await new Promise((resolve, reject)=>{
			// 创建可读流
			const reader = fs.createReadStream(file.path);
			let filePath = path.join(__dirname, '../../excel/') + `${new Date().getTime()}${file.name}`;
			// 创建可写流
			const upStream = fs.createWriteStream(filePath);
			// 可读流通过管道写入可写流
			reader.pipe(upStream);
			reader.on('end', async(err)=>{
				if(err){
					reject(false);
				}
				resolve(filePath);
			});
		});
		return await this.readfilesData(filePath, gameid);
		
		
		

		
		// worksheet.eachRow((row, rownumber)=>{
		// 	var rowSize = row.cellCount;
		// 	var numValues = row.actualCellCount;
		// 	//console.log("单元格数量/实际数量:"+rowSize+"/"+numValues);
		// 	// cell.type单元格类型：6-公式 ;2-数值；3-字符串
		// 	row.eachCell(function(cell, colNumber) {
		// 		if(cell.type==6){
		// 			var value = cell.result;
		// 		}else{
		// 			var value = cell.value;
		// 		}
		// 		console.log('Cell ' + colNumber + ' = ' +cell.type +' ' +value);
		// 	});
		// });
		
			 
		
		
	}
	async downloads(){
		
	}
	async readfilesData(filePath, gameid){
		const Excel = require('exceljs');
		var workbook = new Excel.Workbook();	
		await workbook.xlsx.readFile(filePath);
		var worksheet = workbook.getWorksheet(1);
		var firstcolumns = worksheet.getColumn(1);
		var value = firstcolumns.values;
		var tableKey = value[1];
		var tableValue = [];
		for(let i=2 ;i<value.length;i++){
			tableValue.push(value[i]);
		}
		let sql = `select * from gm_character where gameid='${gameid}' and "${tableKey}" in (${tableValue.map(item => `'${item}'`)})`;
		return await CharacterService.byMany(sql);
	}

	async prohibitedMute(data){
		let banned_type =data.type;
		let banned_area = data.area;
		let banned_reason = data.beacuse;
		let gameid = data.gameid;
		let banned_time = data.time * data.long;
		for(let i of data.value){
			var {account_id, distinct_id,  roleid, role_name, plaform, channel, machine, serverid, level, vip_level, sum_recharge, ip, regtime, update_time, servername} = i;
			var columns = {banned_area, banned_type, gameid, account_id, distinct_id,  roleid, role_name, plaform, channel, machine, serverid, level, vip_level, sum_recharge, ip, regtime, update_time, servername, banned_time, banned_reason};
			dbSequelize.query(`insert into  gm_character 
			(${Object.keys(columns).map(item=>`"${item}"`)})values(${Object.values(columns).map(item=>`'${item}'`)})`);
				   
		}
		let res = await Cp.put(gameid, 'BannedAsk', data);
		return res ;
	}
	async outputConsume(data){
		if(!data.roleid){return false;}
		let token = await CharacterService.byOne(`select token,tablename from gm_game_token where gameid = '${data.gameid}' and type='event' `);
		let tablename = token.tablename;
		token = token.token;
		let {
			roleid, 
			object_id, 
			object_method, 
			object_name, 
			object_type, 
			object_number,
			page,
			pagesize
		  } = data;
		let sql = `select roleid,object_id,object_method,object_name,object_type,object_number,timestamp from ${tablename} where roleid='${roleid}'  order by roleid   offset ${pagesize*(page-1)} limit ${pagesize}`;
		let res =   await Ta.tasql(sql, token);
		let sqls = `select count(object_id) from ${tablename} where roleid='${roleid}'    `;

		let total = await Ta.sqltoTotal(sqls, token);

		return {res, total};
	}

	async backPackQuery(data){
		let url = 'backPackQuery';
		try{
			let res = await Cp.get(url, data);
			res = JSON.parse(res);
			return +res.code === 200 ?res.data:'';
		}catch (err){
			return '';
		}
	}
	async backPackRecycle(data){
		try{
			let url = 'backPackRecycle';
			let res =  await Cp.put(url, data);
			res = JSON.parse(res);
			return res;
		
		}catch (err){
			return false;
		}
	}	

}


export default new CharacterService();