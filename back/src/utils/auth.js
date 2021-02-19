const admin = require("firebase-admin");
const User = require('~Models/user.js');

async function checkAuthUtils (token) {
  try {
    
    if (!token) throw '';
    const user = await admin.auth().verifyIdToken(token);
    const query = User.where({ mail: user.email });
    user.personnalData = await query.findOne();
    if (!user) throw '';
    return user;
  } catch (e) {
    const error = {
      status: 'KO',
      message: e.message || 'UNAUTHORYZED'
    }
    return error;
  }
}

module.exports =  {
  checkAuthUtils
}