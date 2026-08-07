import { JwtRequest } from './user'

declare global {
  namespace Express {
    interface Request {
      user?: JwtRequest
    }
  }
}

export {}
