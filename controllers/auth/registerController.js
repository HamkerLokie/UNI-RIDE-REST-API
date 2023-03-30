import Joi from 'joi'
import bcrypt from 'bcrypt'
import { SALT } from '../../config'
import JwtService from '../../services/JwtServices'

import { User } from '../../models'
import CustomErrorHandler from '../../services/CustomErrorHandler'

const registerController = {
  async register (req, res, next) {
    const registerSchema = Joi.object({
      username: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
      repeat_password: Joi.ref('password')
    })

    const { error } = registerSchema.validate(req.body)

    if (error) {
      return next(error)
    }

    try {
      const exists = await User.exists({ email: req.body.email })

      if (exists) {
        return next(
          CustomErrorHandler.alreadyExists('This E-Mail already exists')
        )
      }
    } catch (error) {
      return next(error)
    }

    // Hash Password
    const { username, email, password } = req.body
    const hashedPass = await bcrypt.hash(password, Number(SALT))

    const user = new User({
      username,
      email,
      password: hashedPass
    })

    let access_token;

    try {
      const result = await user.save()

      access_token = JwtService.sign({
        _id: result._id,
        username: result.username
      })

    } catch (err) {
      return next(err)
    }

    res.json({ access_token })
  }
}

export default registerController
