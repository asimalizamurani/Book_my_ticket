import pool from "../../common/config/db/db.js";

class MovieModel {
    // Get all movies
    static async getAllMovies() {
        try {
            const query = `SELECT * FROM movies ORDER BY id`;
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Get movie by id
    static async getMovieById(id) {
        try {
            const query = `SELECT * FROM movies WHERE id = $1`;
            const result = await pool.query(query, [id]);
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    }
}

export default MovieModel;