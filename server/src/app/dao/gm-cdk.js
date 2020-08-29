/**
* 由模板自动生成
*/
import { dbSequelize } from '../../config';
import BaseDao from '../../lib/base-dao';
import { gmCdkDO } from '../models/gm-cdk';
const gmCdkModel = dbSequelize.import('./../models/gm-cdk');
gmCdkModel.sync({ force: false });
class GmCdkDao extends BaseDao {
  constructor() {
    super(gmCdkModel, gmCdkDO);
  }

}

export default new GmCdkDao();