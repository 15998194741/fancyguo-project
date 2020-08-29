let gmAreaServerDO = {};
export { gmAreaServerDO };
export default function(sequelize, DataTypes) {
	const models = {
		id: {
			type: DataTypes.INTEGER(),
			allowNull: false,
			primaryKey: true,
			field: 'id'
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
		serverId: {
			type: DataTypes.INTEGER(),
			allowNull: true,
			field: 'server_id'
		},
		parentServerId: {
			type: DataTypes.INTEGER(),
			allowNull: true,
			field: 'parent_server_id'
		},
		name: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'name'
		},
		platform: {
			type: DataTypes.INTEGER(),
			allowNull: true,
			field: 'platform'
		},
		codeShow: {
			type: DataTypes.INTEGER(),
			allowNull: true,
			field: 'code_show'
		},
		codeLoad: {
			type: DataTypes.INTEGER(),
			allowNull: true,
			field: 'code_load'
		},
		isNewServer: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'is_new_server'
		},
		openTime: {
			type: DataTypes.DATE(),
			allowNull: true,
			field: 'open_time'
		},
		resourceAdde: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'resource_adde'
		},
		ipPort: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'ip_port'
		},
		gameId: {
			type: DataTypes.INTEGER(),
			allowNull: true,
			field: 'game_id'
		},
		client: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true,
			field: 'client'
		}
	};
	for(let key in models) {
		gmAreaServerDO[key] = '';
	}
	return sequelize.define('gm_area_server', models);
}
