/**
* 由模板自动生成
*/
import { dbSequelize } from '../../config';
import BaseDao from '../../lib/base-dao';
import { gmAnnouncementDO } from '../models/gm-announcement';
const gmAnnouncementModel = dbSequelize.import('./../models/gm-announcement');
gmAnnouncementModel.sync({ force: false });
class GmAnnouncementDao extends BaseDao {
	constructor() {
		super(gmAnnouncementModel, gmAnnouncementDO);
	}

}

export default new GmAnnouncementDao();