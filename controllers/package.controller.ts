import { type Request, type Response } from 'express';
import PackageService from '../services/package.service';

export default {
  async getAll(_: Request, response: Response) {
    const packages = await PackageService.getAll();

    response.send({ packages });
  },
  async updatePackagePrice(request: Request, response: Response) {
    const { packageId } = request.params;
    const { price, municipalityId = null, date } = request.body;

    /**
     * since packageId comes from request.params need to 
     * convert to number, better to do it validation transformer
     */
    const pack = await PackageService.updatePackagePrice({
      packageId: +packageId,
      newPriceCents: price,
      municipalityId,
      date
    });

    response.send({ package: pack });
  }
};
