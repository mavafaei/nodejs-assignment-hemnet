import express from 'express';
import packagesRoutes from './routes/package.routes';
import priceRoutes from './routes/price.routes';
import { seedDb } from './db/seed';
import { sequelizeConnection } from './db/config';

const port = 3000;
export const app = express();

app.listen(port, () => {
  console.log(`Hemnet application running on port ${port}!`);
});
app.use(express.json());

//  Initialize database //
sequelizeConnection.sync({
  // force: true
}).then(async () => {
  console.log('DB running');
  // await seedDb();
});

app.use('/api/packages', packagesRoutes);
app.use('/api/prices', priceRoutes);
