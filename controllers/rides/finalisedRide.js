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
  },

  async onlycancle (req, res, next) {
    try {
      const whoFinalised = await FinalisedRides.find({
        finalisedBy: req.user._id,
        ride: req.params.rideID
      })
      if (whoFinalised[0].finalisedBy.toString() === req.user._id.toString()) {
        res.json({ message: 'My Ride' })
      } else {
        res.json({ message: 'Not My Ride' })
      }
    } catch (error) {
      next(error)
    }
  }
}

export default finalisedRide
