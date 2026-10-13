import express, { type Request, type Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import usersMiddleware from '../middlewares/users-middleware.ts';

const router = express.Router();
const usersFilePath = path.join(import.meta.dirname, '../users.json');

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

router.use(usersMiddleware);

router.get('/', (req: Request, res: Response) => {
  res.json(readUsers());
});

router.get('/:id', (req: Request, res: Response) => {
  const user = readUsers().find((item) => item.id === Number(req.params.id));

  if (!user) {
    res.status(404).json({ message: 'Пользователь не найден' });
    return;
  }

  res.json(user);
});

router.post('/', (req: Request, res: Response) => {
  const users = readUsers();
  const newUser: User = {
    id: Date.now(),
    name: req.body.name,
  };

  users.push(newUser);
  writeUsers(users);

  res.status(201).json(newUser);
});

router.patch('/:id', (req: Request, res: Response) => {
  const users = readUsers();
  const user = users.find((item) => item.id === Number(req.params.id));

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

router.delete('/:id', (req: Request, res: Response) => {
  const users = readUsers();
  const index = users.findIndex((item) => item.id === Number(req.params.id));

  if (index === -1) {
    res.status(404).json({ message: 'Пользователь не найден' });
    return;
  }

  const [deletedUser] = users.splice(index, 1);
  writeUsers(users);

  res.json(deletedUser);
});

export default router;
