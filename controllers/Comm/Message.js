import { Messages } from '../../models'

const Message = {
  async addMsg (req, res, next) {
    const conversationId = req.params.conversationId
    const text = req.body.text
    const saveMessage = new Messages({
      conversationId,
      text,
      sender: req.user._id
    })

    try {
      const savedMsg = await saveMessage.save()
      res.json(savedMsg)
    } catch (error) {
      return next(error)
    }
  },
  async getMsg (req, res, next) {
    try {
      const msgs = await Messages.find({
        conversationId: req.params.conversationId
      })
      res.json(msgs)
    } catch (error) {
      return next(error)
    }
  }
}

export default Message
