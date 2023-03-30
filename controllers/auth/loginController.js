import Joi from 'joi'
import { User } from '../../models'
import bcrypt from 'bcrypt'
import JwtService from '../../services/JwtServices'
import CustomErrorHandler from '../../services/CustomErrorHandler'


const loginController = {
  async login (req, res, next) {
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required()
    })

    const { email, password } = req.body
    const { error } = loginSchema.validate(req.body)
    if (error) {
      return next(error)
    }
    try {
      //   Find User
      const user = await User.findOne({
        email
      })

      if (!user) {
        return next(
          CustomErrorHandler.notExists("User Doesn't Exists, Please Sign Up")
        )
      }
      // Comapre Password
      const match = await bcrypt.compare(password, user.password)

      if (!match) {
        return next(CustomErrorHandler.wrongPassword('Wrong Password'))
      }

      //   Token
      const access_token = JwtService.sign({
        _id: user._id,
        username: user.username
      })
      res.json({ access_token })
    } catch (err) {
      return next(err)
    }
  },

  async getMe(req, res, next){
    res.json(req.user)
  }
}
export default loginController
