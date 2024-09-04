import * as express from 'express';

import packageController from '../controllers/package.controller';

const router = express.Router();

router.get('/', packageController.getAll);
router.patch('/:packageId', packageController.updatePackagePrice);

export default router;
