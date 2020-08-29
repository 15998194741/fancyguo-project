// const graphqlHTTP = require('koa-graphql');
// const {  buildSchema,
// 	GraphQLObjectType,
// 	GraphQLString,
// 	GraphQLInt,
// 	GraphQLSchema,
// 	GraphQLList } =require('graphql');
const mount = require('koa-mount');
const koa = require('koa');
const schemaone = require('./controllers/index');

import { resolve } from 'path';
const dir = path => resolve(__dirname, path);
const apiPath = dir('./controllers');
import fs from 'fs';
import path  from 'path';

let app = new koa();

let apps = fs.readdirSync(apiPath);
for(let i of apps){
	app.use(require(path.join(apiPath, i)));
}





export default mount('/graphql', app);