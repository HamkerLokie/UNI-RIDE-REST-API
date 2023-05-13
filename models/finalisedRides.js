import mongoose, { Schema } from 'mongoose'

const finalisedRidesSchema = mongoose.Schema(
  {
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rides',
      required: true
    },
    finalisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timstamps: true }
)

export default mongoose.model('FinalisedRides', finalisedRidesSchema)
