import { Rides } from '../../models'

const FilterController = {
  async recent (req, res, next) {
    const date = req.params.date
    const currentTime = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata'
    })
    const recentRides = await Rides.find({
      createdAt: { $lte: new Date(currentTime) },
      date
    })
      .populate('driver')
      .sort({ createdAt: -1 })
      .limit(10)
    res.json(recentRides)
  },
  async car (req, res, next) {
    const date = req.params.date
    const carRides = await Rides.find({
      vehicleType: 'Car',
      date,
      isFinalised: false
    }).populate('driver')
    res.json(carRides)
  },
  async bike (req, res, next) {
    const date = req.params.date
    const bikeRides = await Rides.find({
      vehicleType: 'Bike',
      date,
      isFinalised: false
    }).populate('driver')
    res.json(bikeRides)
  },
  async less (req, res, next) {
    const date = req.params.date
    const smallRides = await Rides.find({
      maxPerson: { $lte: 2 },
      date,
      isFinalised: false
    }).populate('driver')
    res.json(smallRides)
  },
  async notfinalised (req, res, next) {
    const date = req.params.date
    const notFinalisedRides = await Rides.find({
      isFinalised: true,
      date
    }).populate('driver')
    res.json(notFinalisedRides)
  }
}

export default FilterController
