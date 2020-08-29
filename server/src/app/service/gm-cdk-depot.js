import gmCdkDepotDao from '../dao/gm-cdk-depot';
import { gmCdkDepotDO } from '../models/gm-cdk-depot';
import BaseService from '../../lib/base-service';
import statusCode from '../../utils/status-code';
const beanUtils = require('../../utils/bean-utils');
class GmCdkDepotService extends BaseService{
	constructor() {
		super(gmCdkDepotDao);
	}

}

export default new GmCdkDepotService();