import jwt from "jsonwebtoken";
import AuthModel from "./auth.model.js";
import ApiError from "../../common/utils/api-error.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw ApiError.unauthorized("Access token required");
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from database
    const user = await AuthModel.findUserById(decoded.id);

    if (!user) {
      throw ApiError.unauthorized("User not found");
    }

    // Attach user to request object
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      next(ApiError.unauthorized("Invalid token"));
    } else if (error.name === "TokenExpiredError") {
      next(ApiError.unauthorized("Token expired"));
    } else {
      next(error);
    }
  }
};

export default authMiddleware;
