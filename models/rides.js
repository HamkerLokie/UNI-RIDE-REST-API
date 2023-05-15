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
    time: {
      type: String
    },
    price: {
      type: String,
      required: true
    },
    vehicleType: {
      type: String,
      required: true
    },
    vehicle: {
      type: String,
      default: 'Not Uploaded by Driver',
      required: true
    },
    vehicleNumber: {
      type: String,
      default: 'Not Uploaded by Driver',

      required: true
    },
    maxPerson: {
      type: Number,
      required: true
    },
    isFinalised: {
      type: Boolean,

      default: false
    }
  },
  { timestamps: true }
)

export default mongoose.model('Rides', rideSchema)
