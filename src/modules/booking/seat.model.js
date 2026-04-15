import pool from "../../common/config/db/db.js";
// import ApiError from "../../utils/api-error.js";
import ApiError from "../../common/utils/api-error.js"
import ApiResponse from "../../common/utils/api-response.js";

class SeatModel {
    // Get all the seats
    static async getAllSeats() {
        try {
            const query = `SELECT * FROM seats ORDER BY id`;
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw ApiError.badRequest('Error fetching seats')
        }
    }

    // Get seat by id
    static async getSeatById(id) {
        try {
            const query = `SELECT * FROM seats WHERE id  = $1`;
            const result = await pool.query(query, [id]);
            
            return result.rows[0] || null;
        } catch (error) {
            throw ApiError.badRequest('Error fetching seat')
        }
    }

    // Book a seat
    static async bookSeat(seatId, userId) {
        const connection = await pool.connect();

        try {
            await connection.query('BEGIN');

            // Check whether the seat is already booked or not
            const selectQuery = `SELECT * FROM seats WHERE id = $1 AND isbooked = 0 FOR UPDATE`;
            const selectResult = await connection.query(selectQuery, [seatId]);

            if (selectResult.rows.length === 0) {
                await connection.query(`ROLLBACK`);
                return { success: false, message: 'Seat is already booked' };
            }

            // Book the seat
            const updateQuery = `UPDATE seats SET isbooked = 1, booked_by = $1 WHERE id = $2 RETURNING *`;
            const updateResult = await connection.query(updateQuery, [userId, seatId]);

            await connection.query(`COMMIT`);

            ApiResponse.ok(res, 'Seat booked successfully', updateResult.rows[0]);
        } catch (error) {
            throw ApiError.badRequest('Error booking seat');
        } finally {
            connection.release();
        }
    }

    // Get bookings
    static async getBookingsByUser(userId) {
        try {
            const query = `SELECT s.*, u.name as booked_by_name FROM seats s LEFT JOIN users u ON s.booked_by = u.id WHERE s.booked_by = $1 ORDER BY s.booked_at DESC`;
            const result = await pool.query(query, [userId]);
            return result.rows;
        } catch (error) {
            throw ApiError.badRequest('Error fetching bookings');
        }
    }
    
}

export default SeatModel;