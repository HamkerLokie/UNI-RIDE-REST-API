import express from 'express'
import {
  registerController,
  loginController,
  postRides,
  locationController,
  finalisedRide,
  driverDetails
} from '../controllers'
import protect from '../middleware/auth'
import onlyAdmin from '../middleware/admin'

const router = express.Router()
router.get('/', (req, res) => {
  res.send('hiii')
})
router.post('/register', registerController.register)
router.post('/login', loginController.login)
router.get('/validate', protect, loginController.validateUser)
router.get('/getAllUsers', protect, loginController.getAllUsers)

// Rides -> needs to improve controllers implementation
router.post('/post-ride', protect, postRides.postride)
router.delete('/delete-ride/:id', protect, postRides.deleteRides)
router.post('/ride-finalised/:rideId', protect, finalisedRide.rideFinalised)
router.put('/star-driver/:driverId', protect, driverDetails.starDriver)

router.get('/search-all-rides', postRides.getAllRides)
router.get('/search-rides-by-date', postRides.getRidesByDate)
router.get('/search/:from/:to/:date', postRides.getRidesByDate)
router.get('/all-my-rides/:id', protect, postRides.myrides)
router.get('/my-finalised-rides', protect, postRides.myFinalisedRides)
router.get('/my-starredDrivers', protect, driverDetails.getStarredDriver)

// Post Locations
router.post(
  '/add-location',
  [protect, onlyAdmin],
  locationController.addLocation
)
router.get('/get-location', locationController.getLocation)

export default router

