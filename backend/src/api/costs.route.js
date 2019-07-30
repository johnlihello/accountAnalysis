import {Router} from 'express';
import costsCtrl from './costs.controller';

const router = new Router();

// associate put, delete, and get(id)
router.route('/get-all-data').get(costsCtrl.getAllData);
router.route('/get-by-date').get(costsCtrl.getDataByDate);
export default router;
