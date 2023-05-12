import mongoose from 'mongoose'

const locationSchema = mongoose.Schema({
  locations: [
    {
      locationName: {
        type: String,
        require: true,
        unique: true,
        index: true 
      }
    }
  ]
})

export default mongoose.model('Location', locationSchema)
