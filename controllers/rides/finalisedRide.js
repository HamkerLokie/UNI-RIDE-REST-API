import { FinalisedRides } from '../../models'
import CustomErrorHandler from '../../services/CustomErrorHandler'
const finalisedRide = {
  async rideFinalised (req, res, next) {
    // const ride = req.params.rideId


    if (!req.params.rideId && !req.user._id) {
      return next(CustomErrorHandler.notExists('Login To Finalise Ride'))
    }

    const finalRide = new FinalisedRides({
      ride:req.params.rideId,
      finalisedBy:req.user._id
    })
    try {
       const result = await finalRide.save()
       res.json({message:"Ride Finalised", result})    

    } catch (error) {
      return next(error)
    }

  }
}

export default finalisedRide
