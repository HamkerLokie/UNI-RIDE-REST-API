import { Conversations } from '../../models'
const Conversation = {
  
  async addConversation (req, res, next) {
    const newConversation = new Conversations({
      members: [req.user._id, req.params.reciverId]
    })

    try {
      const savedConversation = await newConversation.save()
      res.json(savedConversation)
    } catch (error) {
      next(error)
    }
  },
  async getConverstaion (req, res, next) {
    try {
      const conversation = await Conversations.find({
        members: { $all: [req.user._id, req.params.reciverId] }
      }).populate({
        path: 'members',
        select: '-password -__v' // exclude the password field
      })
      res.json(conversation)
    } catch (error) {
      next(error)
    }
  },
  async myConvose (req, res, next) {
    try {
      const cvs = await Conversations.find({
        $or: [{ 'members.0': req.user._id }, { 'members.1': req.user._id }]
      })
        .populate('members')
        .exec()
      res.json(cvs)
    } catch (error) {
      console.log(error)
    }
  }
}

export default Conversation
