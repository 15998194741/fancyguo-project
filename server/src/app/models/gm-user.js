let gmUserDO = {};
export { gmUserDO };
export default function(sequelize, DataTypes) {
	const models = {
		status: {
			type: DataTypes.INTEGER(),
			allowNull: false,
			defaultValue: 1,
			primaryKey: true,
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
		username: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'username'
		},
		password: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'password'
		},
		nickName: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'nick_name'
		},
		avatar: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'avatar'
		},
		email: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'email'
		},
		source: {
			type: DataTypes.INTEGER(),
			allowNull: false,
			defaultValue: 1,
			field: 'source'
		},
		alias: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'alias'
		},
		phone: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'phone'
		},
		wechatUserId: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'wechat_user_id'
		},
		id: {
			type: DataTypes.INTEGER(),
			allowNull: false,
			field: 'id'
		}
	};
	for(let key in models) {
		gmUserDO[key] = '';
	}
	return sequelize.define('gm_user', models);
}
