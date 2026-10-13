import express, { type Express, type Request, type Response } from 'express';
import path from 'node:path';
import logger from './middlewares/logger.ts';
import usersRouter from './routers/users.ts';

const app: Express = express();
const PORT = 3000;
const staticPath = path.join(import.meta.dirname, '../static');

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

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
