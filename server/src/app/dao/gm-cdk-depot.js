/**
* 由模板自动生成
*/
import { dbSequelize } from '../../config';
import BaseDao from '../../lib/base-dao';
import { gmCdkDepotDO } from '../models/gm-cdk-depot';
const gmCdkDepotModel = dbSequelize.import('./../models/gm-cdk-depot');
gmCdkDepotModel.sync({ force: false });
class GmCdkDepotDao extends BaseDao {
  constructor() {
    super(gmCdkDepotModel, gmCdkDepotDO);
  }

}

export default new GmCdkDepotDao();