/**
* 由模板自动生成
*/
import { dbSequelize } from '../../config';
import BaseDao from '../../lib/base-dao';
import { gmSmtpDO } from '../models/gm-smtp';
const gmSmtpModel = dbSequelize.import('./../models/gm-smtp');
gmSmtpModel.sync({ force: false });
class GmSmtpDao extends BaseDao {
  constructor() {
    super(gmSmtpModel, gmSmtpDO);
  }

}

export default new GmSmtpDao();