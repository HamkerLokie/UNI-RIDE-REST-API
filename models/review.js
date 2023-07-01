import mongoose from 'mongoose'

const reviewSchema = mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'User'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'User'
    },
    content: {
      type: String,
      require:true
    },
    stars:{
        type:Number,
        require:true
    }
  },
  { timestamps: true }
)

export default mongoose.model('Reviews', reviewSchema)
