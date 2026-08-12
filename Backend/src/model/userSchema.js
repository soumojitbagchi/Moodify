import  mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,

  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    
  },
  profilePicture: {
    type: String,
    default: "https://imgs.search.brave.com/PixY8_zgl8cU1m2y47bf0V-2jOluOmEHOR4564ScsUA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAwLzY0LzY3LzI3/LzM2MF9GXzY0Njcy/NzM2X1U1a3BkR3M5/a2VVbGw4Q1JRM3Az/WWFFdjJNNnFrVlk1/LmpwZw",
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

const userData = mongoose.model("user", userSchema);

export default userData;