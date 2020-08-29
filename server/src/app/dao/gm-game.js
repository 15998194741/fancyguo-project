/**
* 由模板自动生成
*/
import { dbSequelize } from '../../config';
import BaseDao from '../../lib/base-dao';
import { gmGameDO } from '../models/gm-game';
const gmGameModel = dbSequelize.import('./../models/gm-game');
gmGameModel.sync({ force: false });
class GmGameDao extends BaseDao {
  constructor() {
    super(gmGameModel, gmGameDO);
  }

}

export default new GmGameDao();