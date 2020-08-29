

const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1');
client.on('error', (err)=>{
	console.log(err);
});
client.on('connect', function(){
	console.log('redis连接成功!');
});

client.on('ready', function(res){
	console.log('redis缓存加载成功');
});

class cache{
	constructor(){
	}
	async get(key){
		return await new Promise((resolve, reject)=>{
			client.get(key, (err, res)=>{
				if(err){
					return reject(err);
				}
				return resolve(res);
			});
		});
	}
	async set(key, value){
		return await new Promise((resolve, reject)=>{
			client.set(key, value, (err, res)=>{
				if(err){
					return reject(err);
				}
				return resolve(res);
			});
		});
	}
}


export default new cache();

