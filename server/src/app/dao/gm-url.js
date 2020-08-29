/**
* 由模板自动生成
*/
import { dbSequelize } from '../../config';
import BaseDao from '../../lib/base-dao';
import { gmUrlDO } from '../models/gm-url';
const gmUrlModel = dbSequelize.import('./../models/gm-url');
gmUrlModel.sync({ force: false });
class GmUrlDao extends BaseDao {
  constructor() {
    super(gmUrlModel, gmUrlDO);
  }

}

export default new GmUrlDao();