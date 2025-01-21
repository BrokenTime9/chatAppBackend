const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  owner1 : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner2 : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
});

ChatSchema.index({owner1: 1, owner2: 1},{unique: true});

module.exports = mongoose.model('Chat', ChatSchema);


