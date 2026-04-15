import jwt from "jsonwebtoken";
import AuthModel from "./auth.model.js";
import ApiResponse from "../../common/utils/api-response.js";
import ApiError from "../../common/utils/api-error.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

class AuthController {
  // Register a new user
  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      // Validate input
      if (!name || !email || !password) {
        throw ApiError.badRequest("Name, email, and password are required");
      }

      if (password.length < 6) {
        throw ApiError.badRequest("Password must be at least 6 characters long");
      }

      // Check if email already exists
      const emailExists = await AuthModel.emailExists(email);
      if (emailExists) {
        throw ApiError.conflict("Email already registered");
      }

      // Create user
      const newUser = await AuthModel.createUser(name, email, password);

      // Generate JWT token
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Return response
      ApiResponse.created(res, "User registered successfully", {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email
        },
        token
      });
    } catch (error) {
      next(error);
    }
  }

  // Login user
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        throw ApiError.badRequest("Email and password are required");
      }

      // Find user by email
      const user = await AuthModel.findUserByEmail(email);
      if (!user) {
        throw ApiError.unauthorized("Invalid email or password");
      }

      // Verify password
      const isPasswordValid = await AuthModel.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        throw ApiError.unauthorized("Invalid email or password");
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Return response
      ApiResponse.ok(res, "Login successful", {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      });
    } catch (error) {
      next(error);
    }
  }

  // Get current user profile (protected route)
  static async getProfile(req, res, next) {
    try {
      ApiResponse.ok(res, "Profile retrieved successfully", {
        user: req.user
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
