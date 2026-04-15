import pool from "../../common/config/db/db.js";
import ApiError from "../../common/utils/api-error.js";

import bcrypt from "bcrypt"

class AuthModel {
    static async createUser(name, email, password) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
    
            const query = `
            INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, name, email, created_at
            `;

            const result = await pool.query(query, [name, email, hashedPassword]);
            return result.rows[0];
        } catch (error) {
            throw ApiError.badRequest('Error creating user');
        }
    }

    // Find user by email
    static async findUserByEmail(email) {
        try {
            const query = `
            SELECT * FROM users WHERE email = $1`;
            const result = await pool.query(query, [email]);
            return result.rows[0] || null;
        } catch (error) {
            throw ApiError.badRequest('Error finding user');
        }
    }

    // Now find user by id
    static async findUserById(id) {
        try {
            const query = `
            SELECT id, name, email, created_at FROM users WHERE id = $1`;
            const result = await pool.query(query, [id]);
            return result.rows[0] || null;
        } catch (error) {
            throw ApiError.badRequest('Error finding user');
        }
    }

    static async verifyPassword(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            throw ApiError.badRequest('Error verifying password');
        }
    }

    static async emailExists(email) {
        try {
            const query = `SELECT id FROM users WHERE email = $1`;
            const result = await pool.query(query, [email]);
            return result.rows.length > 0;
        } catch (error) {
            throw ApiError.badRequest('Error checking email existence');
        }
    }

}

export default AuthModel;