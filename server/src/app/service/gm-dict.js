import gmDictDao from '../dao/gm-dict';
import { gmDictDO } from '../models/gm-dict';
import BaseService from '../../lib/base-service';
import statusCode from '../../utils/status-code';
import { dbSequelize } from '../../config';
const beanUtils = require('../../utils/bean-utils');
class GmDictService extends BaseService{
	constructor() {
		super(gmDictDao);
	}
	async findcomponent(parms) {
		let {gameid} = parms ;
		let coms = await dbSequelize.query(`select channel  as  values from gm_game_token where type='areaclothing'  and  gameid='${gameid}'`);
		coms = coms[0][0];
		return coms;
	}
}

export default new GmDictService();