import { Municipality } from '../models/municipality'
import { MunicipalityPackages } from '../models/municipalityPackages'
import { Price } from '../models/price'

const { Op } = require('sequelize');

interface history {
  [key: string]: number[]
}

export default {
  // You may want to use this empty method 🤔
  async getPriceHistory(params: { packageId: number, municipalityId?: number | null, date: Date }) {
    const { packageId, municipalityId, date } = params
    const year = date.getFullYear()


    // Retrieves the municipality data along with its associated packages and prices
    const municipality = await Municipality.findAll({
      where: municipalityId ? { id: municipalityId } : {},
      include: [
        {
          model: MunicipalityPackages,
          as: 'municipalityPackages',
          where: { packageId },
          include: [
            {
              model: Municipality,
              as: 'municipality',
              attributes: ['name']
            },
            {
              model: Price,
              as: 'prices',
              attributes: ['priceCents'],
              where: {
                changedPriceDate: {
                  [Op.gte]: new Date(year, 0, 1),
                  [Op.lt]: new Date(year + 1, 0, 1)
                }
              }
            }
          ]
        }
      ]
    })


    // Creates an object with the name of the municipality as the key and the prices history as the value
    const history: history = {};

    municipality.forEach(data => {
      if (data.municipalityPackages) {
        const municipalityData = data.municipalityPackages[0]
        if (municipalityData.prices && municipalityData.prices.length > 0) {
          const pricesHistory = municipalityData.prices.map((price: Price) => price.priceCents)

          history[municipalityData.municipality.name] = pricesHistory
        }
      }
    })

    return history
  },
}