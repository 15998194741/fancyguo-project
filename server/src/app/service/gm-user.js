import gmUserDao from '../dao/gm-user';
import { gmUserDO } from '../models/gm-user';
import BaseService from '../../lib/base-service';
import statusCode from '../../utils/status-code';
const beanUtils = require('../../utils/bean-utils');
class GmUserService extends BaseService{
	constructor() {
		super(gmUserDao);
	}

}

export default new GmUserService();