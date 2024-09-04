import { type Request, type Response } from 'express';
import PriceService from '../services/price.service';

export default {
  async getPriceHistory(request: Request, response: Response) {
    const { packageId, municipalityId = null, date } = request.query;

    /**
     * since packageId comes from request.query need to convert
     * to number, better to do it validation transformer
     */
    const history = await PriceService.getPriceHistory({
      packageId: +packageId!,
      municipalityId: municipalityId ? +municipalityId : null,
      date: date ? new Date(date as string) : new Date()
    });

    response.send({ history });
  }
};
