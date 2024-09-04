import { Municipality } from '../models/municipality';
import { MunicipalityPackages } from '../models/municipalityPackages';
import { Package } from '../models/package';
import { Price } from '../models/price';

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRandomYear = (): Date => {
  const years = getRandomInt(0, 10)
  return new Date(new Date().setFullYear(new Date().getFullYear() + years))
}

export const seedDb = async () => {
  await Package.destroy({ truncate: true });
  await Municipality.destroy({ truncate: true });

  await Municipality.bulkCreate([
    { name: 'Göteborg' },
    { name: 'Stockholm' },
    { name: 'Malmo' },
  ], { validate: true });

  const municipalityGothenburg = await Municipality.findOne({ where: { name: 'Göteborg' } }) as Municipality;
  const municipalityStockholm = await Municipality.findOne({ where: { name: 'Stockholm' } }) as Municipality;
  const municipalityMalmo = await Municipality.findOne({ where: { name: 'Malmo' } }) as Municipality;


  await Package.bulkCreate([
    { name: 'basic' },
    { name: 'plus' },
    { name: 'premium' },
    { name: 'amin' },
  ], { validate: true });

  const basic = await Package.findOne({ where: { name: 'basic' } }) as Package;
  const plus = await Package.findOne({ where: { name: 'plus' } }) as Package;
  const premium = await Package.findOne({ where: { name: 'premium' } }) as Package;


  await MunicipalityPackages.bulkCreate([
    { priceCents: 5000, packageId: basic.id, municipalityId: municipalityGothenburg.id },
    { priceCents: 10_000, packageId: basic.id, municipalityId: municipalityStockholm.id },
    { priceCents: 20_000, packageId: basic.id, municipalityId: municipalityMalmo.id },
  ], { validate: true });

  await MunicipalityPackages.bulkCreate([
    { priceCents: 19_990, packageId: plus.id, municipalityId: municipalityGothenburg.id },
    { priceCents: 29_900, packageId: plus.id, municipalityId: municipalityStockholm.id },
    { priceCents: 39_900, packageId: plus.id, municipalityId: municipalityMalmo.id },
  ], { validate: true });

  await MunicipalityPackages.bulkCreate([
    { priceCents: 55_000, packageId: premium.id, municipalityId: municipalityGothenburg.id },
    { priceCents: 66_600, packageId: premium.id, municipalityId: municipalityStockholm.id },
    { priceCents: 77_700, packageId: premium.id, municipalityId: municipalityStockholm.id },
    { priceCents: 88_800, packageId: premium.id, municipalityId: municipalityStockholm.id },
    { priceCents: 99_900, packageId: premium.id, municipalityId: municipalityMalmo.id },
  ], { validate: true });

  // In case of we want to migrate the database and current data does not have municipality 
  await MunicipalityPackages.bulkCreate([
    { priceCents: 12_100, packageId: basic.id, municipalityId: null },
    { priceCents: 12_200, packageId: plus.id, municipalityId: null },
    { priceCents: 12_300, packageId: premium.id, municipalityId: null },
  ], { validate: true });



  // Create prices randomly for 14 municipalityPackages and random years
  const prices = [];
  for (let i = 0; i < 100; i++) {
    const year = getRandomYear();
    const municipalityPackage = getRandomInt(1, 14);
    prices.push({
      municipalityPackageId: municipalityPackage,
      prevPriceCents: getRandomInt(1_000, 10_000),
      priceCents: getRandomInt(1_000, 10_000),
      changedPriceDate: year,
      createdAt: year,
      updatedAt: year
    });
  }

  await Price.bulkCreate(prices, { validate: true });

};
