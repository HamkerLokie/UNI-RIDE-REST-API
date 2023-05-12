import { User } from '../../models'
import CustomErrorHandler from '../../services/CustomErrorHandler'

const driverDetails = {
  async starDriver (req, res, next) {
    const driverID = req.params.driverId

    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { starredDriver: { driverID: driverID } } },
        { new: true }
      )

      res.json({ message: 'Driver Starred', updatedUser })
    } catch (error) {
      console.error(error)
      res.status(500).send('Internal server error')
    }
  },

  async getStarredDriver (req, res, next) {
    const userId = req.user._id
    try {
      const user = await User.findById(userId)

      if (!user) {
        return CustomErrorHandler.notExists('User Does not exists')
      }

      const starredDrivers = user.starredDriver
      res.status(200).json(starredDrivers)
    } catch (error) {
      return next(error)
    }
  }
}
export default driverDetails
