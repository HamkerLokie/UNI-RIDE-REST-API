import { boolean } from 'joi'
import mongoose, { Schema } from 'mongoose'

const rideSchema = mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    from: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true
    },
    vehicle: {
      type: String,
      required: true
    },
    vehicleNumber: {
      type: String,
      required: true
    },
    maxPerson: {
      type: Number,
      required: true
    },
    isFinalised:{
      type:Boolean,
      default:false
    }
  },
  { timstamps: true }
)

export default mongoose.model('Rides', rideSchema)
