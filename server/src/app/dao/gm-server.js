/**
* 由模板自动生成
*/
import { dbSequelize } from '../../config';
import BaseDao from '../../lib/base-dao';
import { gmServerDO } from '../models/gm-server';
const gmServerModel = dbSequelize.import('./../models/gm-server');
gmServerModel.sync({ force: false });
class GmServerDao extends BaseDao {
  constructor() {
    super(gmServerModel, gmServerDO);
  }

}

export default new GmServerDao();