import jwt from 'jsonwebtoken'

export const decodeJwtToken = <T>(token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!) as T
}