import { FinalisedRides, Rides } from '../../models'
import CustomErrorHandler from '../../services/CustomErrorHandler'
const finalisedRide = {
  async rideFinalised (req, res, next) {
    // const ride = req.params.rideId

    if (!req.params.rideId && !req.user._id) {
      return next(CustomErrorHandler.notExists('Login To Finalise Ride'))
    }

    const finalRide = new FinalisedRides({
      ride: req.params.rideId,
      finalisedBy: req.user._id
    })
    try {
      const ride = await Rides.updateOne(
        { _id: req.params.rideId },
        { $set: { isFinalised: true } }
      )

      const result = await finalRide.save()

      if (ride && result) {
        res.json({ message: 'Ride Finalised', result, ride })
      }
    } catch (error) {
      return next(error)
    }
  }
}

export default finalisedRide
