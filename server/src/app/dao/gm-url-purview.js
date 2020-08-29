/**
* 由模板自动生成
*/
import { dbSequelize } from '../../config';
import BaseDao from '../../lib/base-dao';
import { gmUrlPurviewDO } from '../models/gm-url-purview';
const gmUrlPurviewModel = dbSequelize.import('./../models/gm-url-purview');
gmUrlPurviewModel.sync({ force: false });
class GmUrlPurviewDao extends BaseDao {
  constructor() {
    super(gmUrlPurviewModel, gmUrlPurviewDO);
  }

}

export default new GmUrlPurviewDao();