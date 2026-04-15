import express from "express";
import SeatModel from "./seat.model.js";
import authMiddleware from "../auth/auth.middleware.js";
import ApiResponse from "../../common/utils/api-response.js";
import ApiError from "../../common/utils/api-error.js";

const router = express.Router();

// Get all seats (public)
router.get("/", async (req, res, next) => {
  try {
    const seats = await SeatModel.getAllSeats();
    ApiResponse.ok(res, "Seats retrieved successfully", seats);
  } catch (error) {
    next(error);
  }
});

// Book a seat (protected)
router.put("/book/:id", authMiddleware, async (req, res, next) => {
  try {
    const seatId = parseInt(req.params.id);
    const userId = req.user.id;

    if (!seatId || seatId < 1) {
      throw ApiError.badRequest("Invalid seat ID");
    }

    const result = await SeatModel.bookSeat(seatId, userId);

    if (!result.success) {
      throw ApiError.conflict(result.message);
    }

    ApiResponse.ok(res, "Seat booked successfully", result.data);
  } catch (error) {
    next(error);
  }
});

// Get user's bookings (protected)
router.get("/my-bookings", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookings = await SeatModel.getBookingsByUser(userId);
    ApiResponse.ok(res, "Bookings retrieved successfully", bookings);
  } catch (error) {
    next(error);
  }
});

export default router;