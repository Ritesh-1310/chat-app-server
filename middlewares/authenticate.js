const jwt = require('jsonwebtoken');

// Middleware function to authenticate user
const authenticate = (req, res, next) => {
  try {
    // Log full request headers and cookies for debugging
    // console.log('Request Headers:', req.headers);
    // console.log('Request Cookies:', req.cookies);
    // console.log('Request endpoint:', req.url); 

    // Extract the token from the Authorization header, cookies, or raw cookie string
    const token = req.header('Authorization')?.split(' ')[1] || 
                  req.cookies.token || 
                  req.headers.cookie?.split('=')[1]?.split(';')[0];

    // Log the token for debugging
    // console.log('Extracted Token:', token);

    if (!token) {
      return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to the request object
    req.user = verified;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid Token', error });
  }
};

module.exports = authenticate;
