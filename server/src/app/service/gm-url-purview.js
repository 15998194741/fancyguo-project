import gmUrlPurviewDao from '../dao/gm-url-purview';
import { gmUrlPurviewDO } from '../models/gm-url-purview';
import BaseService from '../../lib/base-service';
import statusCode from '../../utils/status-code';
const beanUtils = require('../../utils/bean-utils');
class GmUrlPurviewService extends BaseService{
	constructor() {
		super(gmUrlPurviewDao);
	}

}

export default new GmUrlPurviewService();