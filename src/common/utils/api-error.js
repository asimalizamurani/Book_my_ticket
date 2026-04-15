class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor)
    }

    static badRequest(message) {
        return new ApiError(400, message);
    }

    static unauthorized(message) {
        return new ApiError(401, message);
    }

    static conflict(message) {
        return new ApiError(409, message);
    }

    static forbidden(message) {
        return new ApiError(412, message);
    }

    static notFound(message) {
        return new ApiError(404, message);
    }
}

export default ApiError;