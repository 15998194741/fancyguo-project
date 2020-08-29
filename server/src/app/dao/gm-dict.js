/**
* 由模板自动生成
*/
import { dbSequelize } from '../../config';
import BaseDao from '../../lib/base-dao';
import { gmDictDO } from '../models/gm-dict';
const gmDictModel = dbSequelize.import('./../models/gm-dict');
gmDictModel.sync({ force: false });
class GmDictDao extends BaseDao {
  constructor() {
    super(gmDictModel, gmDictDO);
  }

}

export default new GmDictDao();