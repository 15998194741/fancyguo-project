const koa = require('koa');
const app = new koa();
const json = require('koa-json');
const bodyparser = require('koa-bodyparser');

app.use(json());
// app.use(bodyparser({
// 	enableTypes:['json', 'form', 'text'],
// 	'jsonLimit': '2mb'
// }));
// 挂载全部的中间件
require('./middleware')(app);
// let graphql = require('./graphql/index');
// app.use(graphql);

// let prod = 10010;
let prod = 8080;
if (process.env.NODE_ENV === 'production') {
	prod = process.env.PORT;
	prod = 8080;
	console.log('服务端部署，端口号为：', process.env.PORT);
}
console.log(prod);
app.listen(prod, () => {
	console.log(`服务已经启动,请直接访问${prod}`);
	console.log(`http://localhost:${prod}`);
});