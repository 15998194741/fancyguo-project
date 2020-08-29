import gmAreaServerDao from '../dao/gm-area-server';
import { gmAreaServerDO } from '../models/gm-area-server';
import BaseService from '../../lib/base-service';
import statusCode from '../../utils/status-code';
const beanUtils = require('../../utils/bean-utils');
class GmAreaServerService extends BaseService{
	constructor() {
		super(gmAreaServerDao);
	}

}

export default new GmAreaServerService();