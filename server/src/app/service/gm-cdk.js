import gmCdkDao from '../dao/gm-cdk';
import { gmCdkDO } from '../models/gm-cdk';
import BaseService from '../../lib/base-service';
import statusCode from '../../utils/status-code';
const beanUtils = require('../../utils/bean-utils');
class GmCdkService extends BaseService{
	constructor() {
		super(gmCdkDao);
	}

}

export default new GmCdkService();