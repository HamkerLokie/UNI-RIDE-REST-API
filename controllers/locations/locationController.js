import CustomErrorHandler from '../../services/CustomErrorHandler'
import { Location } from '../../models'
import Joi from 'joi'
const locationController = {
  async addLocation (req, res, next) {
    const locationSchema = Joi.object({
      locationName: Joi.string().required()
    })

    const { error } = locationSchema.validate(req.body)

    if (error) {
      return next(error)
    }
    const { locationName } = req.body

    try {
      let location = await Location.findOne()

      if (!location) {
        location = new Location()
      }

      location.locations.push({ locationName: req.body.locationName })

      await location.save()

      res.json(location)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'An error occurred' })
    }
  },

  async getLocation (req, res, next) {
    try {
      const location = await Location.findOne()

      if (!location) {
        res.json({ locations: [] })
      } else {
        const sortedLocations = location.locations.sort((a, b) => {
          if (a.locationName < b.locationName) return -1
          if (a.locationName > b.locationName) return 1
          
          return 0
        })
        res.json({ locations: sortedLocations })
      }
    } catch (error) {
      console.log(error)
      return next(CustomErrorHandler.notExists('Error While Fetching Data'))
    }
  }
}

export default locationController
