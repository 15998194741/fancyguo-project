let gmDictDO = {};
export { gmDictDO };
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
		code: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'code'
		},
		desc: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'desc'
		},
		priority: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'priority'
		},
		values: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true,
			field: 'values'
		},
		gameid: {
			type: DataTypes.INTEGER(),
			allowNull: true,
			field: 'gameid'
		}
	};
	for(let key in models) {
		gmDictDO[key] = '';
	}
	return sequelize.define('gm_dict', models);
}
