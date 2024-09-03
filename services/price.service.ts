import { Municipality } from '../models/municipality'
import { MunicipalityPackages } from '../models/municipalityPackages'
import { Package } from '../models/package'
import { Price } from '../models/price'
import { sequelizeConnection } from '../db/config';

const { Op } = require('sequelize');

interface history {
  [key: string]: number[]
}

export default {
  // You may want to use this empty method 🤔
  async getPriceHistory(params: { packageId: number, municipalityId?: number | null, date: Date }) {
    const { packageId, municipalityId, date } = params
    const history: history = {}

    const year = date.getFullYear()
    const municipalityPackages = await MunicipalityPackages.findAll({
      include: [{
        model: Municipality,
        as: 'municipality'
      }],
      attributes: ['priceCents'],
    });

    const municipality = await Municipality.findAll({
      where: municipalityId ? { id: municipalityId } : {},
      include: [
        {
          model: MunicipalityPackages,
          as: 'municipalityPackages',
          where: { packageId },
          include: [
            {
              model: Price,
              as: 'prices',
              attributes: ['priceCents'],
              where: {
                createdAt: {
                  [Op.gte]: new Date(year, 0, 1),
                  [Op.lt]: new Date(year + 1, 0, 1)
                }
              }
            }
          ]
        }
      ]
    })

    municipalityPackages.forEach(municipality => {
      history[municipality.municipality.name] = [municipality.priceCents]
    })

    municipality.forEach(data => {
      if (data.municipalityPackages) {
        const municipalityData = data.municipalityPackages[0]
        if (municipalityData.prices && municipalityData.prices.length > 0) {
          const pricesHistory = municipalityData.prices.map((price: any) => price.priceCents)


          history[data.name].push(...pricesHistory)

          // history[data.name].push(history[data.name].shift()!) 
        }
      }
    })



    return history
  },
}