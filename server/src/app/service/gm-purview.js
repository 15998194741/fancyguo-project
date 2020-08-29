import gmPurviewDao from '../dao/gm-purview';
import { gmPurviewDO } from '../models/gm-purview';
import BaseService from '../../lib/base-service';
import statusCode from '../../utils/status-code';
const beanUtils = require('../../utils/bean-utils');
class GmPurviewService extends BaseService{
	constructor() {
		super(gmPurviewDao);
	}

}

export default new GmPurviewService();