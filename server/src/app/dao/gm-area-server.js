/**
* 由模板自动生成
*/
import { dbSequelize } from '../../config';
import BaseDao from '../../lib/base-dao';
import { gmAreaServerDO } from '../models/gm-area-server';
const gmAreaServerModel = dbSequelize.import('./../models/gm-area-server');
gmAreaServerModel.sync({ force: false });
class GmAreaServerDao extends BaseDao {
  constructor() {
    super(gmAreaServerModel, gmAreaServerDO);
  }

}

export default new GmAreaServerDao();