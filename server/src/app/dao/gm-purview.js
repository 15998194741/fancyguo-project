/**
* 由模板自动生成
*/
import { dbSequelize } from '../../config';
import BaseDao from '../../lib/base-dao';
import { gmPurviewDO } from '../models/gm-purview';
const gmPurviewModel = dbSequelize.import('./../models/gm-purview');
gmPurviewModel.sync({ force: false });
class GmPurviewDao extends BaseDao {
  constructor() {
    super(gmPurviewModel, gmPurviewDO);
  }

}

export default new GmPurviewDao();