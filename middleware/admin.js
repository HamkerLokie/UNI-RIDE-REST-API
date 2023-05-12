import CustomErrorHandler from '../services/CustomErrorHandler'
import { SECRETKEYFORFOUNDER } from '../config'
import { User } from '../models';
const onlyAdmin = async (req, res, next) => {
    const userId = req.user._id;

    const adminData = await User.findOne({_id:userId})
    console.log(adminData);
    try {
        if(adminData.role === SECRETKEYFORFOUNDER){
            req.adminData = adminData;
            next();
        }else{
           return next(CustomErrorHandler.unAuthorised('Something Went Wrong'))
        }

    } catch (error) {
        console.log('error');
        next(error)
    }

}

export default onlyAdmin
