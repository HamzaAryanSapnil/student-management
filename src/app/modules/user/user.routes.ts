;import  express  from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from '../auth/auth.validation';




const router = express.Router()

// create student

router.post("/create-student", auth("ADMIN"), validateRequest(AuthValidation.userSignupSchema));


export const UserRoutes = router


