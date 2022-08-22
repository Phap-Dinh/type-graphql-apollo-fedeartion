import { Response } from 'express'

export type MyContext = {
  authorization: string;
  res: Response;
}
