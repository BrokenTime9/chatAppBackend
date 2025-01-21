const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  timestamp : {
    type: Date,
    default: Date.now
  },
  chatId : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}); 

module.exports = mongoose.model('Message', MessageSchema);
