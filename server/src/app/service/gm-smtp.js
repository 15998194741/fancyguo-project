import gmSmtpDao from '../dao/gm-smtp';
import { gmSmtpDO } from '../models/gm-smtp';
import BaseService from '../../lib/base-service';
import statusCode from '../../utils/status-code';
const beanUtils = require('../../utils/bean-utils');
class GmSmtpService extends BaseService{
	constructor() {
		super(gmSmtpDao);
	}

}

export default new GmSmtpService();