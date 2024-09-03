import * as express from 'express';

import priceController from '../controllers/price.controller';

const router = express.Router();

router.get('/', priceController.getPriceHistory);
 
export default router;
