import jwt from 'jsonwebtoken'
import { User } from '../models'
import CustomErrorHandler from '../services/CustomErrorHandler'
import JwtService from '../services/JwtServices'

const protect = async (req, res, next) => {
  let authHeader = req.headers.authorization
  if (!authHeader) {
    return next(CustomErrorHandler.unAuthorised('unAuthorised'))
  }
  let token = authHeader.split(' ')[1]

  try {
    const { _id, username } = JwtService.verify(token)

    const user = {
      _id,
      username
    }

    req.user = user
    next()
  } catch (error) {
    return next(CustomErrorHandler.unAuthorized())
  }
}

export default protect
