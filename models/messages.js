import mongoose from 'mongoose'

const messageSchema = mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Conversation'
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'User'
    },
    text: {
      type: String,
      require:true
    }
  },
  { timestamps: true }
)

export default mongoose.model('Messages', messageSchema)
