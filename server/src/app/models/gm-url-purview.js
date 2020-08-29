let gmUrlPurviewDO = {};
export { gmUrlPurviewDO };
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
		purviewId: {
			type: DataTypes.INTEGER(),
			allowNull: true,
			field: 'purview_id'
		},
		urlId: {
			type: DataTypes.INTEGER(),
			allowNull: true,
			field: 'url_id'
		},
		grede: {
			type: DataTypes.INTEGER(),
			allowNull: true,
			field: 'grede'
		}
	};
	for(let key in models) {
		gmUrlPurviewDO[key] = '';
	}
	return sequelize.define('gm_url_purview', models);
}
