import { dbSequelize } from '../config';

const request = require('request');

class Cp{
	constructor(){	
		this.url= 'http://localhost:30000/api/';
	}
	async post(gameid, url, data){
		let urls =await dbSequelize.query(`select url from gm_game_token where gameid=${gameid} and type = 'cp'`);
		urls = urls[0][0].url;
		let res = {
			url:urls+'/api/'+url,
			method:'POST',
			data
		};
		return new Promise((resolve, reject)=>{
			request(res, (error, response, body)=>{
				return resolve(JSON.parse(body));
			});
		}); 
	}

	async get(url, query){
		let res = {
			url:this.url+url,
			method:'GET',
			query
		};
		return new Promise((resolve, reject)=>{
			request(res, (error, response, body)=>{
				// if(!error && response.statusCode == 200){
				return resolve(JSON.parse(body));
				
			});

		}); 
	}
	async put(gameid, url, data){
		let urls =await dbSequelize.query(`select url from gm_game_token where gameid=${gameid} and type = 'cp'`);
		urls = urls[0][0].url;
		let res = {
			url:urls+'/api/'+url,
			method:'PUT',
			data
		};
		return new Promise((resolve, reject)=>{
			request(res, (error, response, body)=>{
				return resolve(JSON.parse(body));
			});
		}); 
	}
	async sendBulletin(gameid, arr){
		let urls =await dbSequelize.query(`select url from gm_game_token where gameid=${gameid} and type = 'cp'`);
		urls = urls[0][0].url;
		// let data = await dbSequelize.query(`select * from gm_announcement where id in ( ${arr})`);
		let data = {
			arr,
			urls
		};
		let url = 'announcement';
		let res = {
			url:'http://127.0.0.1:12345/api/sendmsg',
			method:'POST',
			data
		};
		return new Promise((resolve, reject)=>{
			request(res, (error, response, body)=>{
				return resolve(JSON.parse(body));
			});
		}); 
	}
	async insertBulletin(data, name){
		let {gameid} = data;
		if(data['channel'].indexOf(',') != -1){
			data['channel'] = data['channel'].split(',');
		}
		data['images'] = name?'http://106.75.7.83:12345/bulletin/images/'+name:'';
		let urls =await dbSequelize.query(`select url from gm_game_token where gameid=${gameid} and type = 'cp'`);
		urls = urls[0][0].url;
		let res = {
			url:urls+'/api/announcement/insertBulletin',
			method:'POST',
			data
		};
		return new Promise((resolve, reject)=>{
			request(res, (error, response, body)=>{
				return resolve(JSON.parse(body));
			});
		}); 
	}
	async insertMarquee(data){
		let {gameid} = data;
		if(data['channel'].indexOf(',') != -1){
			data['channel'] = data['channel'].split(',');
		}
		if(data['servername'].indexOf(',') != -1){
			data['servername'] = data['servername'].split(',');
		}
		let urls =await dbSequelize.query(`select url from gm_game_token where gameid=${gameid} and type = 'cp'`);
		urls = urls[0][0].url;
		let res = {
			url:urls+'/api/announcement/insertMarquee',
			method:'POST',
			data
		};
		return new Promise((resolve, reject)=>{
			request(res, (error, response, body)=>{
				return body?resolve(JSON.parse(body)):reject('nodata');
				 
			});
		}); 
	}
	async updateMarquee(data){
		let {gameid} = data;
		let urls =await dbSequelize.query(`select url from gm_game_token where gameid=${gameid} and type = 'cp'`);
		urls = urls[0][0].url;
		let res = {
			url:urls+'/api/announcement/updateMarquee',
			method:'POST',
			data
		};
		return new Promise((resolve, reject)=>{
			request(res, (error, response, body)=>{
				return resolve(JSON.parse(body));
			});
		}); 
	}
	async updateBulletin(data){
		let {gameid} = data;
		data['a'] = data['link'];
		data['images'] = data['img_url'];
		data['channel'] = data['client'];
		let urls =await dbSequelize.query(`select url from gm_game_token where gameid=${gameid} and type = 'cp'`);
		urls = urls[0][0].url;
		
		let res = {
			url:urls+'/api/announcement/updateBulletin',
			method:'POST',
			data
		};
		return new Promise((resolve, reject)=>{
			request(res, (error, response, body)=>{
				return resolve(JSON.parse(body));
			});
		}); 
	}
	async stopannouncement(data){
		let {gameid} = data;
		let urls = await dbSequelize.query(`select url from gm_game_token where gameid=${gameid} and type = 'cp'`);
		urls = urls[0][0].url;
		let res = {
			url:urls+'/api/announcement/stopannouncement',
			method:'POST',
			data
		};
		return new Promise((resolve, reject)=>{
			request(res, (error, response, body)=>{
				return resolve(body);
			});
		}); 
	}

}

export default new Cp();