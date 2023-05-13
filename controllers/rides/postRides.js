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

      if (driver.driver != req.user._id || ride.finalisedBy != req.user._id) {
        return res
          .status(401)
          .send({ error: 'You are not authorized to cancel this ride' })
      }

      ride.isFinalised = false
      await ride.save()

      await FinalisedRides.deleteOne({ _id: rideId })

      res.send({ message: 'Ride cancelled successfully' })
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
      console.error(err)
      res.status(500).json({ error: 'An error occurred' })
    }
  },

  async myrides (req, res, next) {
    const id = req.user._id
    try {
      const response = await Rides.find({ driver: id })
      res.json(response)
    } catch (error) {
      next(error)
    }
  },
  async myFinalisedRides (req, res, next) {
    const id = req.user._id

    try {
      const rideArray = await FinalisedRides.find({ finalisedBy: id }).populate(
        {
          path: 'ride',
          select: '-__v',
          populate: {
            path: 'driver',
            select: '-__v'
          }
        }
      )

      for (let i = 0; i < rideArray.length; i++) {
        const ride = rideArray[i].ride
        await Rides.updateOne(
          { _id: ride._id },
          { $set: { isFinalised: true } }
        )
      }

      res.json(rideArray)
    } catch (error) {
      return next(error)
    }
  }
}
export default postRides
