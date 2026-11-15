import { type Request, type Response, type NextFunction } from 'express';

const myLogger = function (req: Request, res: Response, next: NextFunction) {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
};

export default myLogger;
