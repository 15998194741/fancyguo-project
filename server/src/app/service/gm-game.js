import gmGameDao from '../dao/gm-game';
import { gmGameDO } from '../models/gm-game';
import BaseService from '../../lib/base-service';
import statusCode from '../../utils/status-code';
const beanUtils = require('../../utils/bean-utils');
class GmGameService extends BaseService{
	constructor() {
		super(gmGameDao);
	}

}

export default new GmGameService();