import express from 'express'; 
import { protect } from '../middleware/authMiddleware.js'; 
import { getUserData, storeRecentSearchedCities } from '../controllers/userController.js'; 

const userRouter = express.Router(); 

// Endpoint to fetch user profile data
userRouter.get('/', protect, getUserData); 

// Endpoint to update recent search history
userRouter.post('/store-recent-search', protect, storeRecentSearchedCities); 

export default userRouter; 