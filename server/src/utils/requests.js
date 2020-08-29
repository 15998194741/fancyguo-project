



const request = require('request');

class Ta{
	constructor(){
		this.form = {
			'sql':'',
			'token':'YErNGkQ0L94iVtuWV8MusVmckw1C3k3cS08yTw5U02BilgzNKF71AtiGeMUenMDn',
			'format':'csv'
		};
		this.headers={
			'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryT24eFfuVgUmT7SsO',
			'Accept':'application/json, text/javascript, */*; q=0.01',
			'Accept-Encoding':'gzip, deflate'
		};
		this.url= 'http://103.210.21.117:8992/querySql';
		this.method = 'POST';
		this.res='';
	}
	async tasql(sql, token){

		let req ={
			url:this.url,
			method:this.method,
			headers:this.headers,
			form:{
				sql,
				token,
				
			}};
		let res = await new Promise((resolve, reject)=>{
			request(req, (error, response, body)=>{
				if(!error && response.statusCode == 200){
					let talist = body.split('\r\n');
					
					try{
						talist[0] = JSON.parse(talist[0]).data.headers;
						for(let i = 1 ;i<talist.length-1;i++){
							talist[i]= eval(talist[i]);	
						}
						talist.pop();
						return resolve(talist);
					} catch (err){
						return resolve(false);

					}
				}else{
					console.log(error);
					return reject(error);				
				}
			});
		}); 
		if(!res){return '';}
		let resu = [];
		for(let i=0;i<res[0].length;i++){
			res[0][i]= res[0][i].replace(/^#(.*)$/, '$1');
		}
		for(let i=1;i<res.length;i++){
			var a = {};
			for(let j=0;j<res[0].length;j++){
				a[res[0][j]]=res[i][j];
			}
			resu.push(a);
		}
		return resu;
	}

	async sqltoTotal(sql, token){
		let req ={
			url:this.url,
			method:this.method,
			headers:this.headers,
			form:{
				sql,
				token,
				
			}};
		let res = await new Promise((resolve, reject)=>{
			request(req, (error, response, body)=>{
				if(!error && response.statusCode == 200){
					let talist = body.split('\r\n');
					return resolve(talist);
				}else{
					console.log(error);
					return reject(error);				
				}
			});

		}); 
		try{
			res  = await eval(res[1])[0];
		}catch{
			return 0;
		}
		return res;
	}






	//根据表名字，token查找区服数据
	async findqf(token, tablename){
		let sql = `select msid,sid,name,plaform,channel,display,load,srttime from ${tablename}`;
		let res ={
			url:this.url,
			method:this.method,
			headers:this.headers,
			form:{
				sql,
				token
			}};
		return new Promise((resolve, reject)=>{
			request(res, (error, response, body)=>{
				if(!error && response.statusCode == 200){
					try{
						let talist = body.split('\r\n');
						talist[0] = JSON.parse(talist[0]).data.headers;
						for(let i = 1 ;i<talist.length-1;i++){
							talist[i]= eval(talist[i]);
						}
						return resolve(talist);
					}catch{

					}
					
					
				}else{
					return reject(error);				
				}
			});
		}); 
	}
	//区服创建
	async create(form){
		let res ={
			url:'',
			method:'POST',
			form};
		return new Promise((resolve, reject)=>{
			request(res, (error, response, body)=>{
				if(!error && response.statusCode == 200){
					return resolve(body);
				}else{
					return reject(error);				
				}
			});
		}); 
	}
	//区服更新
	async update(form){
		let res ={
			url:'',
			method:'PUT',
			form};
		return new Promise((resolve, reject)=>{
			request(res, (error, response, body)=>{
				if(!error && response.statusCode == 200){
					return resolve(body);
				}else{
					return ;			
				}
			});

		}); 
	}
	//区服批量更新
	async operating(form){
		let res ={
			url:'',
			method:'PUT',
			form};
		return new Promise((resolve, reject)=>{
			request(res, (error, response, body)=>{
				if(!error && response.statusCode == 200){
					return resolve(body);
				}else{
					return reject(error);				
				}
			});
		}); 
	}
}
export default new Ta();