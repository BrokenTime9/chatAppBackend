const { date } = require("joi");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    //req
    //unique
    type: String,
    required: true,
    unique: true,
  },
  email: {
    //unique
    //sparse
    type: String,
    unique: true,
    sparse: true,
  },
  googleId: {
    //unique
    //sparse
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: function () {
      return this.loginType === "local";
    },
  },
  loginType: {
    //required
    type: String,
    enum: ["local", "google"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
