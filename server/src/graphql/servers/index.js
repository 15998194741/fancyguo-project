class value{
	async hello(ctx, test, ok){
		console.log( ctx, test, ok);
		return JSON.stringify({hello:'helloworld',
			ok:'4546'});
	}
	// hello(ctx){
	// 	console.log(ctx.name,ctx.time)
	// 	return 'helloworld'+'4546';
	// }
	async super(){
		return 'ojbk';
	}
}





module.exports = new value();