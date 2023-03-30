import express from 'express'
import {registerController, loginController, postRides} from '../controllers'
import protect from '../middleware/auth';

const router = express.Router();

router.post('/register', registerController.register)
router.post('/login', loginController.login)
router.get('/users', protect ,loginController.getMe)

// Rides -> needs to improve controllers implementation
router.post('/post-ride', protect, postRides.postride)
router.get('/search-ride', postRides.getRides)




export default router