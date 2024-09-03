import { Municipality } from '../../models/municipality';
import { Package } from '../../models/package';
import PackageService from '../../services/package.service';
import PriceService from '../../services/price.service';
import { sequelizeConnection } from '../../db/config';

describe('PriceService', () => {
  // Set the db object to a variable which can be accessed throughout the whole test file
  const db = sequelizeConnection;

  // Before any tests run, clear the DB and run migrations with Sequelize sync()
  beforeEach(async () => {
    await db.sync({ force: true });
  });

  afterAll(async () => {
    await db.close();
  });

  it('Returns the pricing history for the provided year and package', async () => {
    const basic = await Package.create({ name: 'basic' });
    const municipalityGoteborg = await Municipality.create({ name: 'Göteborg' });
    const municipalityStockholm = await Municipality.create({ name: 'Stockholm' });

    const date = new Date();

    // These should NOT be included
    date.setFullYear(2019);
    await PackageService.updatePackagePrice({ packageId: basic.id, newPriceCents: 20_00, municipalityId: municipalityGoteborg.id, date });
    await PackageService.updatePackagePrice({ packageId: basic.id, newPriceCents: 30_00, municipalityId: municipalityStockholm.id, date });


    date.setFullYear(2020);
    await PackageService.updatePackagePrice({ packageId: basic.id, newPriceCents: 30_00, municipalityId: municipalityGoteborg.id, date });
    await PackageService.updatePackagePrice({ packageId: basic.id, newPriceCents: 40_00, municipalityId: municipalityStockholm.id, date });
    await PackageService.updatePackagePrice({ packageId: basic.id, newPriceCents: 100_00, municipalityId: municipalityStockholm.id, date });

    expect(await PriceService.getPriceHistory({ packageId: basic.id, date })).toBe({
      Göteborg: [30_00],
      // Stockholm: [40_00, 100_00],
      Stockholm: [100_00, 40_00],
    });
  });

  // it('Supports filtering on municipality', async () => {
  //   const basic = await Package.create({ name: 'basic' });
  //   const municipalityGoteborg = await Municipality.create({ name: 'Göteborg' });
  //   const municipalityStockholm = await Municipality.create({ name: 'Stockholm' });

  //   const date = new Date();

  //   date.setFullYear(2020);
  //   await PackageService.updatePackagePrice({ packageId: basic.id, newPriceCents: 20_00, municipalityId: municipalityGoteborg.id, date });
  //   await PackageService.updatePackagePrice({ packageId: basic.id, newPriceCents: 60_00, municipalityId: municipalityGoteborg.id, date });
  //   await PackageService.updatePackagePrice({ packageId: basic.id, newPriceCents: 30_00, municipalityId: municipalityGoteborg.id, date });
  //   await PackageService.updatePackagePrice({ packageId: basic.id, newPriceCents: 70_00, municipalityId: municipalityGoteborg.id, date });
  //   await PackageService.updatePackagePrice({ packageId: basic.id, newPriceCents: 30_00, municipalityId: municipalityStockholm.id, date });
  //   await PackageService.updatePackagePrice({ packageId: basic.id, newPriceCents: 100_00, municipalityId: municipalityStockholm.id, date });



  //   expect(await PriceService.getPriceHistory({ packageId: basic.id, municipalityId: municipalityGoteborg.id, date })).toBe({
  //     Göteborg: [20_00, 60_00, 30_00, 70_00],
  //   });


  //   expect(await PriceService.getPriceHistory({ packageId: basic.id, municipalityId: municipalityStockholm.id, date })).toBe({
  //     Stockholm: [30_00, 100_00],
  //   });
  // })
});
