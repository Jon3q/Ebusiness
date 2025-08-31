const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,        // dla logowania własnego
  oauthProvider: String,   // np. 'google'
  oauthId: String,         // id od dostawcy
  serverToken: String
});

module.exports = mongoose.model('User', UserSchema);
