import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  let token;

  // 1. Extract token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find user
      // 4. Attach user to req.user
      req.user = await User.findById(decoded.user.id).select('-password');

      // 5. Call next()
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // 6. If invalid (no token) -> return 401
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export default authMiddleware;