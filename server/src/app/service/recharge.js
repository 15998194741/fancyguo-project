import Ta from '../../utils/requests';
import Cp from '../../utils/Cp';
import { reject } from 'ramda';
import { dbSequelize } from '../../config';

var mysql  = require('mysql');  
 
var connection = mysql.createConnection({     
	host     : '117.50.10.34',       
	user     : 'gmfancyguo',              
	password : 'gmfancyguo!',       
	port: '3306',                   
	database: 'sdk' 
}); 
connection.connect();

class rechargeService{
	constructor() {
		var mysql  = require('mysql');  
		var connection = mysql.createConnection({     
			host     : '117.50.10.34',       
			user     : 'gmfancyguo',              
			password : 'gmfancyguo!',       
			port: '3306',                   
			database: 'sdk' 
		}); 
		connection.connect();
	}

	async query(data){
		var mysql  = require('mysql');  
		var connection = mysql.createConnection({     
			host     : '117.50.10.34',       
			user     : 'gmfancyguo',              
			password : 'gmfancyguo!',       
			port: '3306',                   
			database: 'sdk' 
		}); 
		connection.connect();
		let {roleid, stime, plaform, servername, page, pagesize, gameid} = data;
		gameid =22222222;
		let srttime = data['srttime[]'];
		let channel = data['channel[]'];
		let serverid ;
		if(servername){
			 serverid = await dbSequelize.query(`select serverid from gm_server where  servername ='${servername}' `);
			serverid = serverid[0][0].serverid;		
		}
		
		let where = `where  appid ='${gameid}'`;
		where += !channel?'':typeof channel === 'string'?` and channel =  '${channel}'`:` and channel in (${channel.map(item=>`'${item}'`).join(',')})`;
		where += !roleid?'':` and roleid='${roleid}'`;
		where += !srttime?'':` and a.createdAt between '${srttime[0]}' and '${srttime[1]}'`;
		where += !plaform ?  '' :plaform === '2'?' and type = \'apple\' ':plaform==='1'?' and type in (\'union\',\'alipay\',\'wechat\') ' :'';
		where += !serverid?'':` and serverId = '${serverid}'`;
		var sql = `SELECT 
        roleId,roleName,platform,a.uid,pid,channel,deviceid,isOK,isSend,serverId,price,tid,a.createdAt,a.updatedAt ,type
        FROM  pay AS a 
        LEFT JOIN  
        users AS b 
        ON a.uid=b.uid 
       ${where}
       limit ${pagesize}
       offset ${pagesize*(page-1)} 
        `;
		let totalsql = `SELECT 
        count(*) as total
        FROM  pay AS a 
        LEFT JOIN  
        users AS b 
        ON a.uid=b.uid 
       ${where}`;
		let res = await new Promise((resolve, reject)=>{
			connection.query(sql, async(err, result)=>{
				if(err){
					console.log(err);
					return;
				}
				return resolve(result);
            
			});
		});
		let total = await new Promise((resolve, reject)=>{
			connection.query(totalsql, async(err, result)=>{
				if(err){
					console.log(err);
					return;
				}
				return resolve(result);
            
			});
		});
		res = JSON.parse(JSON.stringify(res));
		total = total[0].total;
		
		connection.end();
		return {res, total};
	}
	async replenishment(data){
		let { gameid }= data;
		return await Cp.post(gameid, 'Replenishment', data);
	}



}

export default new rechargeService();