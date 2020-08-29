let gmUrlDO = {};
export { gmUrlDO };
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
		purview: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'purview'
		},
		url: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'url'
		},
		pid: {
			type: DataTypes.INTEGER(),
			allowNull: true,
			field: 'pid'
		},
		name: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'name'
		},
		priority:{
			type: DataTypes.INTEGER(),
			allowNull: true,
			field: 'priority'
		}
	};
	for(let key in models) {
		gmUrlDO[key] = '';
	}
	return sequelize.define('gm_url', models);
}
