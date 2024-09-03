import { Municipality } from '../models/municipality';
import { MunicipalityPackages } from '../models/municipalityPackages';
import { Package } from '../models/package';
import { Price } from '../models/price';
import { get } from 'http';
import { log } from 'console';
import { sequelizeConnection } from '../db/config'

export default {
  async getAll() {
    return await Package.findAll({});
  },
  async getOne(params: { packageId: number, municipalityId?: number | null }) {
    const { packageId, municipalityId } = params;
    const municipalityPackage = await MunicipalityPackages.findOne({
      where: {
        packageId,
        municipalityId
      },
      include: [{
        model: Package,
        as: 'package'
      }, {
        model: Municipality,
        as: 'municipality'
      }]
    })

    return municipalityPackage;
  },
  async updatePackagePrice(
    params: {
      packageId: number,
      newPriceCents: number,
      municipalityId?: number | null,
      date?: Date | null
    }) {

    try {
      let { packageId, newPriceCents, municipalityId, date } = params;
      await sequelizeConnection.transaction(async t => {

        // some kind of validation here - it should be in routes/schemas in a better world
        const pack = await Package.findByPk(packageId);
        if (!pack) throw new Error('Package not found');

        const municipality = municipalityId ? await Municipality.findByPk(municipalityId) : municipalityId;
        if (!municipality) municipalityId = null;

        const updatePriceDate = date ? new Date(date) : new Date();
        const [currentMunicipalityPackage, createdMunicipalityPackage] = await MunicipalityPackages.findOrCreate({
          where: {
            packageId,
            municipalityId
          },
          defaults: {
            priceCents: newPriceCents,
            date: updatePriceDate,
          },
          transaction: t
        });
        const oldPrice = createdMunicipalityPackage ? newPriceCents : currentMunicipalityPackage.priceCents;
        const oldDate = currentMunicipalityPackage.date;

        // update municipality package and log in case of having new price
        if (oldPrice !== newPriceCents) {
          await Price.create({
            municipalityPackageId: currentMunicipalityPackage.id,
            priceCents: oldPrice,
            createdAt: oldDate,
          }, { transaction: t });



          await currentMunicipalityPackage.update({
            priceCents: newPriceCents,
            date: updatePriceDate,
          }, { transaction: t });
        }

        return currentMunicipalityPackage;
      });

      return this.getOne({ packageId, municipalityId });
    } catch (err: unknown) {
      throw new Error('Error handling the transaction');
    }
  },
  async priceFor(params: { packageId: number, municipalityId: number }) {
    const { packageId, municipalityId } = params
    const foundPackage = await this.getOne({ packageId, municipalityId })

    if (!foundPackage) {
      return null;
    }

    return foundPackage.priceCents
  },
};
