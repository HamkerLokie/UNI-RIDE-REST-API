import { Rides, FinalisedRides } from '../../models'
import CustomErrorHandler from '../../services/CustomErrorHandler'
const postRides = {
  async postride (req, res, next) {
    try {
      const { from, to, date, price, vehicle, vehicleNumber, maxPerson } =
        req.body
console.log(req.body);
      const ride = new Rides({
        driver: req.user._id,
        from,
        to,
        date,
        price,
        vehicle,
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

  async getRidesByDate (req, res, next) {
    const { date } = req.query
    try {
      const rides = await Rides.find({ date }).populate({
        path: 'driver',
        select: '-password -__v'
      })
      res.json(rides)
    } catch (error) {
      return next(CustomErrorHandler.notExists('Error While Fetching Data'))
    }
  },

  async getRidesByLocation (req, res, next) {
    const { from, to, date } = req.params
    try {
      const rides = await Rides.find({ from, to, date }).populate({
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
        await Rides.updateOne({ _id: ride._id }, { $set: { isFinalised: true } })
      }

      res.json(rideArray)
    } catch (error) {
      return next(error)
    }
  }
}
export default postRides
