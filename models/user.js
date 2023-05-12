import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    
    mobile: {
      type: String,
      required: true
    },
    
    role: {
      type: String,
      default: 'User'
    },
    starredDriver: [
      {
        driverId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      }
    ]
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)
