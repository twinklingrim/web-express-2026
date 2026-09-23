import express, { type Express, type Request, type Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';

const app: Express = express();
const PORT = 3000;

// Чтобы express парсил JSON-тело запросов
app.use(express.json());

// Путь к файлу-хранилищу
const usersFilePath = path.join(import.meta.dirname, 'users.json');

// --- Вспомогательные функции для работы с файлом ---

interface User {
  id: number;
  name: string;
}

function readUsers(): User[] {
  const data = fs.readFileSync(usersFilePath, 'utf-8');
  return JSON.parse(data) as User[];
}

function writeUsers(users: User[]): void {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
}

// --- Роуты ---

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/user', (req: Request, res: Response) => {
  const users = readUsers();
  res.json(users);
});

// POST /user — создать нового пользователя
// Тело запроса: { "name": "Roman" }
app.post('/user', (req: Request, res: Response) => {
  const users = readUsers();

  const newUser: User = {
    id: Date.now(),     // id на основе таймстемпа
    name: req.body.name,
  };

  users.push(newUser);
  writeUsers(users);

  res.status(201).json(newUser);
});

// PATCH /user/:id — обновить пользователя по id
// Тело запроса: { "name": "NewName" }
app.patch('/user/:id', (req: Request, res: Response) => {
  const users = readUsers();
  const userId = Number(req.params.id);

  const user = users.find((u) => u.id === userId);

  if (!user) {
    res.status(404).json({ message: 'Пользователь не найден' });
    return;
  }

  if (req.body.name) {
    user.name = req.body.name;
  }

  writeUsers(users);
  res.json(user);
});

// DELETE /user/:id — удалить пользователя по id
app.delete('/user/:id', (req: Request, res: Response) => {
  const users = readUsers();
  const userId = Number(req.params.id);

  const index = users.findIndex((u) => u.id === userId);

  if (index === -1) {
    res.status(404).json({ message: 'Пользователь не найден' });
    return;
  }

  const deleted = users.splice(index, 1);
  writeUsers(users);

  res.json(deleted[0]);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
