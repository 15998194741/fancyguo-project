const {  buildSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList } =require('graphql');
const mount = require('koa-mount');
const graphqlHTTP = require('koa-graphql');
const value = require('../servers/test');
let schemaone = buildSchema(`
type Query {
    hello(name : String, time : String):String,
    super:String,
}
`);

module.exports =  mount('/test', graphqlHTTP({
	schema: schemaone,
	rootValue: value,
	graphiql: true,
}));