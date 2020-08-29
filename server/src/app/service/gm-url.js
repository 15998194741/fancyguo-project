import gmUrlDao from '../dao/gm-url';
import { gmUrlDO } from '../models/gm-url';
import BaseService from '../../lib/base-service';
import statusCode from '../../utils/status-code';
const beanUtils = require('../../utils/bean-utils');
class GmUrlService extends BaseService{
	constructor() {
		super(gmUrlDao);
	}

}

export default new GmUrlService();