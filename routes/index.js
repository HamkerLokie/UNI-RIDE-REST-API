import express from 'express'
import {
  registerController,
  loginController,
  postRides,
  locationController,
  finalisedRide,
  driverDetails,
  Message,
  Conversation
} from '../controllers'
import protect from '../middleware/auth'
import onlyAdmin from '../middleware/admin'
import FilterController from '../controllers/filters/FilterController'

const router = express.Router()
router.get('/', (req, res) => {
  res.send('hiii')
})
router.post('/register', registerController.tempReg)
router.post('/login', loginController.login)
router.get('/validate', protect, loginController.validateUser)
router.get('/getAllUsers', protect, loginController.getAllUsers)
router.get('/getbyID/:id', protect, loginController.getByID)

// Rides -> needs to improve controllers implementation
router.post('/post-ride', protect, postRides.postride)
router.delete('/cancel-ride/:rideId', protect, postRides.cancelRide)
router.delete('/delete-ride/:rideId', protect, postRides.deleteRides)
router.post('/ride-finalised/:rideId', protect, finalisedRide.rideFinalised)
router.put('/star-driver/:driverId', protect, driverDetails.starDriver)
// router.post('addreview/:driverId',protect, postRides.addreview)
router.get('/search-all-rides', postRides.getAllRides)
router.get('/rideByID/:id', postRides.getRidesById)
router.get('/search-rides-by-date', postRides.getRidesByDate)
router.get('/search/:from/:to/:date', protect, postRides.getRidesByLocation)
router.get('/all-my-rides', protect, postRides.myrides)
router.get('/all-my-types/:type', protect, postRides.mybikes)
router.get('/my-finalised-rides', protect, postRides.myFinalisedRides)
router.get('/my-nonfixed-rides', protect, postRides.myfixedRides)
router.get('/my-starredDrivers', protect, driverDetails.getStarredDriver)
router.get('//verify-email/:token', registerController.verify)

router.get('/onlycancel/:rideID', protect, finalisedRide.onlycancle)

// Post Locations
router.post(
  '/add-location',
  [protect, onlyAdmin],
  locationController.addLocation
)
router.get('/get-location', locationController.getLocation)

// Filters

router.get('/mostrecent/:date', FilterController.recent)
router.get('/onlycar/:date', FilterController.car)
router.get('/onlybike/:date', FilterController.bike)
router.get('/lestthan2/:date', FilterController.less)
router.get('/notfinalised/:date', FilterController.notfinalised)

// Conversations
router.post('/new/conver/:reciverId', protect, Conversation.addConversation)
router.get('/myconversations/:reciverId', protect, Conversation.getConverstaion)
router.get('/myconvos', protect, Conversation.myConvose)

// Messages
router.post('/new/msg/:conversationId', protect, Message.addMsg)
router.get('/mymsgs/:conversationId', protect, Message.getMsg)

export default router
