const jwt = require('jsonwebtoken');
const auth = (req, res, next) => {

    const token = req.cookies.USER_COOKIE;
  
    if (!token) {
      return res.status(401).json({ error: "Please Login" });
    }
  
    try {
      const verifyUser = jwt.verify(token, process.env.SECRET_CODE_WEB_TOKENS);
      req.user = verifyUser;  
      next();
    }
    catch (error) {
      return res.status(401).json({ error: "Invalid User" });
    }
  }

  module.exports = auth;