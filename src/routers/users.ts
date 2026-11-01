import express, { type Request, type Response } from 'express';
import usersMiddleware from '../middlewares/users-middleware.ts';
import { User } from '../models/User.ts';

const router = express.Router();

router.use(usersMiddleware);
router.use(express.urlencoded());
router.use(express.json());

// GET /users — получить всех пользователей
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// GET /users/:id — получить одного пользователя по id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// POST /users — создать нового пользователя
router.post('/', async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Failed to create user' });
  }
});

// PATCH /users/:id — обновить существующего пользователя
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Failed to update user' });
  }
});

// DELETE /users/:id — удалить пользователя из базы данных
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

export default router;
