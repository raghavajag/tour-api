class ErrorResponse {
    constructor(message, statusCode = 500, field = null, errors = []) {
        this.message = message;
        this.statusCode = statusCode;
        this.field = field;
        this.errors = Array.isArray(errors) ? errors : [errors];
    }
}

module.exports = ErrorResponse;
