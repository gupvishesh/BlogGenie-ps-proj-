const jwt = require('jsonwebtoken');

const secret = "$uperMan@123";

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };
  const token = jwt.sign(payload, secret);
  return token;
}

function validateToken(token) {
  const payload = jwt.verify(token, secret);
  return payload;
}

// Middleware to check for authentication cookie
function checkForAuthenticationCookie (cookieName) {
    return (req, res, next) => {
        const token = req.cookies[cookieName];
        if (!token) return next();

        try {
            const userPayload = validateToken(token);
            req.user = userPayload;
            next();
        } catch (error) {
            next();
        }
    };
};

module.exports = { createTokenForUser, validateToken , checkForAuthenticationCookie };
