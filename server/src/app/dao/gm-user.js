/**
* 由模板自动生成
*/
import { dbSequelize } from '../../config';
import BaseDao from '../../lib/base-dao';
import { gmUserDO } from '../models/gm-user';
const gmUserModel = dbSequelize.import('./../models/gm-user');
gmUserModel.sync({ force: false });
class GmUserDao extends BaseDao {
  constructor() {
    super(gmUserModel, gmUserDO);
  }

}

export default new GmUserDao();