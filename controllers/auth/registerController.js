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
      mobile: Joi.number().required(),
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
      repeat_password: Joi.ref('password'),
      role: Joi.string()
    })

    const { error } = registerSchema.validate(req.body)

    if (error) {
      return next(error)
    }

    if (req.body.password !== req.body.repeat_password) {
      return next(CustomErrorHandler.unauthorized('Passwords do not match'))
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
    const { username, email, mobile, password } = req.body
    const hashedPass = await bcrypt.hash(password, Number(SALT))

    const verificationToken = crypto.randomBytes(20).toString('hex')

    const user = new User({
      username,
      email,
      mobile,
      password: hashedPass,
      verificationToken,
      verificationExpires: Date.now() + 24 * 3600 * 1000 // 24 hours
    })

    let access_token

    try {
      const result = await user.save()

      access_token = JwtService.sign({
        _id: result._id,
        username: result.username
      })

      const verificationUrl = `${req.protocol}://${req.get(
        'host'
      )}/api/auth/verify-email/${verificationToken}`
      const message = `Please click the following link to verify your email address: ${verificationUrl}`

      // Send verification email
      await EmailService.send({
        to: user.email,
        subject: 'Verify your email address',
        text: message
      })

      res
        .cookie('token', access_token, { sameSite: 'none', secure: true })
        .status(201)
        .json({
          id: user._id
        })
    } catch (err) {
      return next(err)
    }

    res.json({ access_token })
  },
  async tempReg (req, res, next) {
    const registerSchema = Joi.object({
      username: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      mobile: Joi.number().required(),
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
      repeat_password: Joi.ref('password'),
      role: Joi.string()
    })

    const { error } = registerSchema.validate(req.body)

    if (error) {
      return next(error)
    }
    if (req.body.password !== req.body.repeat_password) {
      return next(CustomErrorHandler.unauthorized('Passwords do not match'))
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
    const { username, email, mobile, password } = req.body
    const hashedPass = await bcrypt.hash(password, Number(SALT))

    const user = new User({
      username,
      email,
      mobile,
      password: hashedPass
    })
    let access_token

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
  },
  async verify(req, res, next){
    const { token } = req.params

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: Date.now() }
    })

    if (!user) {
      return next(CustomErrorHandler.unauthorized('Invalid verification token'))
    }

    user.emailVerified = true
    user.verificationToken = undefined
    user.verificationExpires = undefined
    await user.save()

    res.json({ message: 'Email address verified' })
  } catch (err) {
    return next(err)
  }
  }
}

export default registerController
