import { Rides, FinalisedRides } from '../../models'
import CustomErrorHandler from '../../services/CustomErrorHandler'
const postRides = {
  async postride (req, res, next) {
    try {
      const {
        from,
        vehicleType,
        to,
        time,
        date,
        price,
        vehicle,
        vehicleNumber,
        maxPerson
      } = req.body
      const ride = new Rides({
        driver: req.user._id,
        from,
        to,
        date,
        time,
        price,
        vehicle,
        vehicleType,
        vehicleNumber,
        maxPerson
      })
      await ride.save()
      res.status(201).json({ message: 'Posted', ride })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async getAllRides (req, res, next) {
    const { from, to } = req.query
    try {
      const rides = await Rides.find({ from, to }).populate({
        path: 'driver',
        select: '-password -__v'
      })
      res.json(rides)
    } catch (error) {
      return next(CustomErrorHandler.notExists('Error While Fetching Data'))
    }
  },
  async cancelRide (req, res, next) {
    const { rideId } = req.params
    try {
      const driver = await Rides.findOne({ _id: rideId })
      const ride = await FinalisedRides.findOne({ finalisedBy: req.user._id })
      if (!ride) {
        return res.status(404).send({ error: 'Ride not found' })
      }

      if (
        driver.driver.toString() === req.user._id.toString() ||
        ride.finalisedBy.toString() === req.user._id.toString()
      ) {
        driver.isFinalised = false
        await driver.save()

        await FinalisedRides.deleteOne({ ride: rideId })

        res.send({ message: 'Ride cancelled successfully' })
      } else {
        return res
          .status(401)
          .send({ error: 'You are not authorized to cancel this ride' })
      }
    } catch (error) {
      return next(CustomErrorHandler.notExists('Error While Fetching Data'))
    }
  },
  async getRidesById (req, res, next) {
    const { id } = req.params
    try {
      const rides = await Rides.findById(id).populate({
        path: 'driver',
        select: '-password -__v'
      })
      res.json({ rides })
    } catch (error) {
      return next(CustomErrorHandler.notExists('Error While Fetching Data'))
    }
  },

  async getRidesByDate (req, res, next) {},

  async getRidesByLocation (req, res, next) {
    const { from, to, date } = req.params
    try {
      const rides = await Rides.find({
        from,
        to,
        date,
        isFinalised: false,
        driver: { $ne: req.user._id }
      }).populate({
        path: 'driver',
        select: '-password -__v'
      })
      res.json(rides)
    } catch (error) {
      return next(CustomErrorHandler.notExists('Error While Fetching Data'))
    }
  },

  async deleteRides (req, res, next) {
    const { id } = req.params
    try {
      const ride = await Rides.findByIdAndDelete(id)
      if (!ride) {
        res.status(404).json({ error: 'Ride not found' })
      } else {
        res.json({ message: 'Ride deleted successfully' })
      }
    } catch (err) {
      res.status(500).json({ error: 'An error occurred' })
    }
  },

  async myrides (req, res, next) {
    const id = req.user._id
    try {
      const response = await Rides.find({ driver: id })
        .populate('driver')
        .sort({ createdAt: 'desc' })
      res.json(response)
    } catch (error) {
      next(error)
    }
  },

  async mybikes (req, res, next) {
    const id = req.user._id
    try {
      const response = await Rides.find({ driver: id, vehicleType: req.params.type })
        .populate('driver')
        .sort({ createdAt: 'desc' })
      res.json(response)
    } catch (error) {
      next(error)
    }
  },

  async myFinalisedRides (req, res, next) {
    const id = req.user._id

    try {
      const rides = await Rides.find({ driver: id }).populate('driver')
      const ridesFinalisedByUser = await Promise.all(
        rides.map(async ride => {
          const rideWithFinalisedBy = await FinalisedRides.findOne({
            ride: ride._id
          })
            .populate('ride')
            .populate('finalisedBy')
          if (!rideWithFinalisedBy) {
            return null
          }
          return rideWithFinalisedBy
        })
      )
      // filter out null values from the array
      const filteredRides = ridesFinalisedByUser.filter(ride => ride !== null)
      res.json(filteredRides)
    } catch (error) {
      return next(error)
    }
  },
  async myfixedRides (req, res, next) {
    const id = req.user._id

    try {
      const rides = await Rides.find({ driver: id, isFinalised:false}).populate('driver')
   
      res.json(rides)
    } catch (error) {
      return next(error)
    }
  }
}
export default postRides
