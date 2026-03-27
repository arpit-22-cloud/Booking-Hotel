import mongoose from 'mongoose'; 

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true }, 
  username: { type: String, required: true }, 
  email: { type: String, required: true },
  image: { type: String, default: "" },
  role: { 
    type: String, 
    enum: ['user', 'hotel owner'], 
    default: 'user' 
  },
  recentSearchedCities: [ 
    { type: String, required: true }
  ]
}, { timestamps: true }); 

const User = mongoose.model('user', userSchema); 
export default User;