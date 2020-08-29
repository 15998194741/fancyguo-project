let gmSmtpDO = {};
export { gmSmtpDO };
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
		smtpId: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'smtp_id'
		},
		title: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'title'
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
		player: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'player'
		},
		content: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'content'
		},
		sendtime: {
			type: DataTypes.DATE(),
			allowNull: true,
			field: 'sendtime'
		},
		annex: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true,
			field: 'annex'
		},
		gameId: {
			type: DataTypes.INTEGER(),
			allowNull: true,
			field: 'game_id'
		}
	};
	for(let key in models) {
		gmSmtpDO[key] = '';
	}
	return sequelize.define('gm_smtp', models);
}
