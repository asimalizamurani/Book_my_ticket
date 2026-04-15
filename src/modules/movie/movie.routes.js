import express from "express";
import MovieModel from "./movie.model.js";
import ApiResponse from "../../common/utils/api-response.js";

const router = express.Router();

// Get all movies (public)
router.get("/", async (req, res, next) => {
  try {
    const movies = await MovieModel.getAllMovies();
    ApiResponse.ok(res, "Movies retrieved successfully", movies);
  } catch (error) {
    next(error);
  }
});

// Get movie by id (public)
router.get("/:id", async (req, res, next) => {
  try {
    const movieId = parseInt(req.params.id);
    const movie = await MovieModel.getMovieById(movieId);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }

    ApiResponse.ok(res, "Movie retrieved successfully", movie);
  } catch (error) {
    next(error);
  }
});

export default router;