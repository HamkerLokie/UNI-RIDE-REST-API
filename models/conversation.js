import mongoose from 'mongoose'

const convSchema = mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
)

export default mongoose.model('Conversation', convSchema)
