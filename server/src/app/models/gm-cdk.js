let gmCdkDO = {};
export { gmCdkDO };
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
		cdkid: {
			type: DataTypes.INTEGER(),
			allowNull: true,
			field: 'cdkid'
		},
		name : {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'name '
		},
		platform: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'platform'
		},
		client: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'client'
		},
		type: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'type'
		},
		num: {
			type: DataTypes.INTEGER(),
			allowNull: true,
			field: 'num'
		},
		startTime: {
			type: DataTypes.DATE(),
			allowNull: true,
			field: 'start_time'
		},
		endTime : {
			type: DataTypes.DATE(),
			allowNull: true,
			field: 'end_time '
		},
		content: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'content'
		},
		gameId: {
			type: DataTypes.INTEGER(),
			allowNull: true,
			field: 'game_id'
		}
	};
	for(let key in models) {
		gmCdkDO[key] = '';
	}
	return sequelize.define('gm_cdk', models);
}
