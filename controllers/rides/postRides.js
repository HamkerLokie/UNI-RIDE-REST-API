import { Rides } from "../../models"
const postRides = {

  async postride (req, res, next) {
    try {
      const { from, to, date, price, vehicle, vehicleNumber, maxPerson } =
        req.body
      const ride = new Rides({
        driver: req.user._id,
        from,
        to,
        date,
        price,
        vehicle,
        vehicleNumber,
        maxPerson
      })
      await ride.save()
      res.status(201).json({message:'ride posted', ride})
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async getRides(req, res, next){
    const { from, to } = req.query;
    try {
      // Query database for rides that match the criteria
      const rides = await Rides.find({ from, to }).populate('driver');
      res.json(rides);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}
export default postRides
