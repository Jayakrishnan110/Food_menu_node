const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Check for Authorization header and valid format
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      const token = req.headers.authorization.split(" ").pop();
      const jwtSecret = process.env.JWT_SECRET;
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;
      next();
    } else {
      // Handle missing or invalid Authorization header
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token has expired" });
    } else if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token" });
    } else {
      next(err);
    }
  }
};
