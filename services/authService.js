require('dotenv').config()

module.exports = {
  authenticate(email, password) {},
  authorize(token) {
    if (token === process.env.AUTH_TOKEN) return true;
    return false;
  }
};
