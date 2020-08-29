let gmAnnouncementDO = {};
export { gmAnnouncementDO };
export default function(sequelize, DataTypes) {
	const models = {
		id: {
			type: DataTypes.INTEGER(),
			allowNull: false,
			field: 'id',
			primaryKey: true,
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
		type: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'type'
		},
		endTime: {
			type: DataTypes.DATE(),
			allowNull: true,
			field: 'end_time'
		},
		startTime: {
			type: DataTypes.DATE(),
			allowNull: true,
			field: 'start_time'
		},
		annoStatus: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'anno_status'
		},
		title: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'title'
		},
		areaServerId: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'area_server_id'
		},
		client: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'client'
		},
		platform: {
			type: DataTypes.INTEGER(),
			allowNull: true,
			field: 'platform'
		},
		gameId: {
			type: DataTypes.INTEGER(),
			allowNull: true,
			field: 'game_id'
		},
		text: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'text'
		},
		timeInterval : {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'time_interval '
		},
		imgUrl: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'img_url'
		},
		weights: {
			type: DataTypes.INTEGER(),
			allowNull: true,
			field: 'weights'
		},
		link: {
			type: DataTypes.STRING(),
			allowNull: true,
			field: 'link'
		}
	};
	for(let key in models) {
		gmAnnouncementDO[key] = '';
	}
	return sequelize.define('gm_announcement', models);
}
