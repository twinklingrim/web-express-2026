import express, { type Express, type Request, type Response } from 'express';
import path from 'node:path';
import logger from './middlewares/logger.ts';
import usersRouter from './routers/users.ts';
import productsRouter from './routers/products.ts';
import ordersRouter from './routers/orders.ts';
import connectDB from './utils/connectDB.ts';
import swaggerUi from 'swagger-ui-express';
import { openapiSpecification } from './utils/swagger.ts';


const app: Express = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification)); 
const PORT = 3000;
const staticPath = path.join(import.meta.dirname, '../static');

async function main() {
  await connectDB();

  app.use(logger);

  // Чтобы Express парсил JSON-тело запросов.
  app.use(express.json());

  app.use(express.static(staticPath));

  app.get('/about', (req: Request, res: Response) => {
    res.sendFile('about.html', { root: staticPath });
  });

  app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
  });

  // Все CRUD-маршруты пользователей сгруппированы в отдельном Router.
  // /user сохранён для совместимости, /users — REST-вариант.
  app.use(['/user', '/users'], usersRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}

main().catch((error) => {
  console.error('Failed to start app:', error);
  process.exit(1);
});