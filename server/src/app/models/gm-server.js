let gmServerDO = {};
export { gmServerDO };
export default function(sequelize, DataTypes) {
	const models = {
		id: {
			type: DataTypes.INTEGER(),
			allowNull: true,
			field: 'id',
			primaryKey: true,
			autoIncrement: true,
		},
		status: {
			type: DataTypes.INTEGER(),
			allowNull: true,
			defaultValue: 1,
			field: 'status'
		},
		createUserId: {
			type: DataTypes.INTEGER(),
			allowNull: true,
			field: 'create_user_id'
		},
		updateUserId: {
			type: DataTypes.INTEGER(),
			allowNull: true,
			field: 'update_user_id'
		},
		createTime: {
			type: DataTypes.DATE(),
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'create_time'
		},
		updateTime: {
			type: DataTypes.DATE(),
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'update_time'
		},
		servername: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'servername'
		},
		ip: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'ip'
		},
		address: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'address'
		},
		plaform: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'plaform'
		},
		display: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'display'
		},
		srttime: {
			type: DataTypes.DATE(),
			allowNull: true,
			field: 'srttime'
		},
		channel: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true,
			field: 'channel'
		},
		gamename: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'gamename'
		},
		pid: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'pid'
		},
		serverid: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'serverid'
		},
		test: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'test'
		},
		load: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'load'
		},
		gameid: {
			type: DataTypes.INTEGER(),
			allowNull: true,
			field: 'gameid'
		}
	};
	for(let key in models) {
		gmServerDO[key] = '';
	}
	return sequelize.define('gm_server', models);
}
